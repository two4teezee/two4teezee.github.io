#!/usr/bin/env node
/**
 * Static frame-data extractor for an IKEMEN GO / M.U.G.E.N character.
 *
 *   node extract.mjs <char dir> [--states 200-699] [--set name=value ...]
 *                    [--json] [--markdown] [--refs]
 *
 * Reads the character's .def to find its files, then for every state in range
 * that holds a HitDef: the animation's timeline from the .air (Clsn1 = active),
 * each HitDef's damage, hitstun, blockstun, guard flag and knockdown, and how
 * the state ends. Expressions are evaluated where they are plain arithmetic,
 * `ifelse`/`cond` and `map(...)`; `--set strength=2` supplies a map's value,
 * which is how a special's L/M/H or EX version is picked. Anything that still
 * can't be evaluated is reported as written, never guessed.
 *
 * Conventions (the ones the site's frametables use):
 *   startup  = frames before the first active frame, plus that frame
 *   active   = frames with a Clsn1; several windows -> `a-b,c-d` ranges
 *   recovery = frames after the last active one until the animation ends
 *   advantage = stun - frames from the hit's first contact frame to the end
 */
import { argument, loadCharacter } from "./lib.mjs";

// ---------------------------------------------------------------- arguments
const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--") && !/^\w+=/.test(a));
if (!dir) {
	console.error(
		"usage: node extract.mjs <char dir> [--states 200-699] [--set name=value] [--json|--markdown] [--refs]",
	);
	process.exit(1);
}
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
	const i = args.indexOf(`--${name}`);
	return i === -1 ? undefined : args[i + 1];
};
const ranges = (option("states") || "200-699").split(",").map((r) => {
	const [lo, hi] = r.split("-").map(Number);
	return [lo, hi ?? lo];
});
const inRange = (id) => ranges.some(([lo, hi]) => id >= lo && id <= hi);
const maps = {};
args.forEach((a, i) => {
	if (args[i - 1] === "--set") {
		const [k, v] = a.split("=");
		maps[k.toLowerCase()] = Number(v);
	}
});

// ------------------------------------------------------------ expressions
/** Evaluate a MUGEN expression if it only uses arithmetic, comparisons,
 *  ifelse/cond and map(); otherwise return null. */
function evaluate(expr) {
	if (expr == null) return null;
	let js = String(expr).replace(/;.*/, "").trim();
	if (!js) return null;
	// `map(x) := v` is an assignment that yields v.
	js = js.replace(/map\(\s*"?([\w.]+)"?\s*\)\s*:=\s*/gi, "");
	js = js.replace(/map\(\s*"?([\w.]+)"?\s*\)/gi, (_, name) =>
		String(maps[name.toLowerCase()] ?? 0),
	);
	js = js.replace(/\b(ifelse|cond)\s*\(/gi, "IF(");
	js = js.replace(/(?<![!<>:=])=(?!=)/g, "==");
	if (/[A-Za-z_]/.test(js.replace(/\bIF\(/g, ""))) return null;
	try {
		const value = Function("IF", `return (${js});`)((c, a, b) => (c ? a : b));
		if (typeof value === "boolean") return value ? 1 : 0;
		return Number.isFinite(value) ? Math.round(value * 1000) / 1000 : null;
	} catch {
		return null;
	}
}
const readValue = (raw, n = 0) => {
	const arg = argument(raw, n);
	if (arg == null || arg === "") return { value: null, raw: null };
	return { value: evaluate(arg), raw: arg };
};

const ch = loadCharacter(dir);
const { defFile, air, stateFiles, zssFiles, allStates, byId } = ch;

// ---------------------------------------------------------------- analysis
const typeOf = (c) => (c.props.type || "").trim().toLowerCase();
/* triggerall is ANDed with each numbered group; the groups are ORed. */
const triggerText = (c) => {
	const groups = new Map();
	for (const t of c.triggers) {
		const key = t.key === "triggerall" ? "all" : t.key;
		groups.set(key, [...(groups.get(key) || []), t.value.trim()]);
	}
	const all = groups.get("all") || [];
	groups.delete("all");
	const ors = [...groups.values()].map((g) => g.join(" && "));
	const body =
		ors.length > 1 ? ors.map((o) => `(${o})`).join(" || ") : (ors[0] ?? "");
	return [...all, body].filter(Boolean).join(" && ");
};

/** The anim a state plays: Statedef anim, or a ChangeAnim at time 0. */
function animOf(st) {
	const change = st.ctrls.find(
		(c) =>
			typeOf(c) === "changeanim" &&
			c.triggers.some((t) =>
				/^(!time|time\s*(<=|=)\s*0)$/i.test(t.value.trim()),
			),
	);
	const source = change ? change.props.value : st.props.anim;
	const { value, raw } = readValue(source ?? String(st.id));
	return { anim: value, raw };
}

/** First tick of animation element `k` (1-based). */
const elemStart = (frames, k) =>
	frames.slice(0, k - 1).reduce((sum, f) => sum + Math.max(f.ticks, 0), 0);

/* A HitDef is often switched on an element before its Clsn1 appears, so
   contact is the first active tick at or after the trigger. */
function hitTiming(ctrl, frames, timeline) {
	let from = 0;
	for (const t of ctrl.triggers) {
		const m =
			t.value.match(/animelem\s*=\s*(\d+)/i) ||
			t.value.match(/animelemtime\(\s*(\d+)\s*\)\s*(>=|=)\s*0/i);
		if (m) {
			from = elemStart(frames, Number(m[1]));
			break;
		}
	}
	const contact = timeline.indexOf(true, from);
	return { from, contact: contact === -1 ? from : contact };
}

const guardName = (flag) => {
	const f = (flag || "").toUpperCase();
	if (!f) return "unblockable";
	if (f.includes("M") || (f.includes("H") && f.includes("L"))) return "mid";
	if (f.includes("H")) return "high";
	if (f.includes("L")) return "low";
	return f;
};

function analyse(st) {
	const hitdefs = st.ctrls.filter((c) => typeOf(c) === "hitdef");
	const projectiles = st.ctrls.filter((c) => typeOf(c) === "projectile");
	const helpers = st.ctrls.filter((c) => typeOf(c) === "helper");
	/* A helper that attacks - a projectile or a summoned partner - attacks on
	   this state's behalf, so the state is a move even with no HitDef of its
	   own. The helper's HitDef may sit a few states on, or in a helper of its
	   own, so follow both. */
	const attacks = (id, seen = new Set()) => {
		const target = byId.get(id);
		if (!target || seen.has(id)) return false;
		seen.add(id);
		return target.ctrls.some((h) => {
			const type = typeOf(h);
			if (type === "hitdef" || type === "projectile") return true;
			const next =
				type === "helper"
					? readValue(h.props.stateno).value
					: type === "changestate"
						? readValue(h.props.value).value
						: null;
			return typeof next === "number" && attacks(next, seen);
		});
	};
	const attackHelpers = helpers.filter((c) =>
		attacks(readValue(c.props.stateno).value),
	);
	if (!hitdefs.length && !projectiles.length && !attackHelpers.length) {
		return null;
	}

	const { anim, raw: animRaw } = animOf(st);
	const frames = anim != null ? air[String(anim)] : null;
	const out = {
		id: st.id,
		name: st.name,
		where: `${st.file}:${st.line}`,
		statetype: (st.props.type || "").trim().toUpperCase(),
		anim: anim ?? animRaw,
		warnings: [],
	};
	if (!frames) {
		out.warnings.push(
			`animation ${anim ?? animRaw} not found or not evaluable`,
		);
		return out;
	}

	const timeline = frames.flatMap((f) =>
		Array(Math.max(f.ticks, 0)).fill(f.hit),
	);
	if (frames.some((f) => f.ticks < 0))
		out.warnings.push("animation has an infinite (-1) frame");
	const total = timeline.length;
	const windows = [];
	timeline.forEach((on, i) => {
		if (!on) return;
		const last = windows.at(-1);
		if (last && last[1] === i) last[1] = i + 1;
		else windows.push([i, i + 1]);
	});

	// How the state ends.
	const exits = st.ctrls
		.filter((c) => ["changestate", "selfstate"].includes(typeOf(c)))
		.map((c) => ({
			to: readValue(c.props.value).value ?? c.props.value,
			when: triggerText(c),
			onAnimEnd: /(^|&&\s*)(!animtime|animtime\s*=\s*0)\s*($|&&)/i.test(
				triggerText(c),
			),
		}));
	/* Only a return to neutral ends the move: stand (0), crouch (11), landing
	   (52). Anything else at the animation's end is the move carrying on in
	   another state, so the advantage isn't known from this one. */
	const IDLE = new Set([0, 11, 52]);
	const atEnd = exits.find((e) => e.onAnimEnd);
	const animEnd = atEnd && IDLE.has(atEnd.to) ? atEnd : null;
	out.ends = animEnd
		? { onAnimEnd: true, to: animEnd.to }
		: { onAnimEnd: false, exits };
	if (atEnd && !animEnd) {
		out.warnings.push(
			`carries on into state ${atEnd.to} when the animation ends: advantage comes from that state, not this one`,
		);
	} else if (!animEnd) {
		out.warnings.push(
			`doesn't end on animation end (${exits.map((e) => `-> ${e.to} when ${e.when}`).join("; ") || "no exit found"}): timing past the anim needs the engine`,
		);
	}

	out.total = total;
	if (windows.length) {
		const first = windows[0][0];
		const lastActive = windows.at(-1)[1];
		out.startup = first + 1;
		/* Several windows are written as counts in order, with the frames
		   between them as recovery: `active=2 recovery=6 active=2`. */
		out.active = windows.map(([a, b]) => b - a).join("+");
		out.activeFrames = windows.map(([a, b]) => `${a + 1}-${b}`).join(",");
		out.recovery = total - lastActive;
		const bar = windows.flatMap(([a, b], i) =>
			i === 0
				? [`active=${b - a}`]
				: [`recovery=${a - windows[i - 1][1]}`, `active=${b - a}`],
		);
		out.frames = `startup=${out.startup} ${bar.join(" ")} recovery=${out.recovery}`;
	} else {
		out.warnings.push(
			"no Clsn1 in the animation (projectile or helper does the hitting?)",
		);
	}

	out.hits = hitdefs.map((c) => {
		const trig = triggerText(c);
		const { from, contact } = hitTiming(c, frames, timeline);
		const damage = readValue(c.props.damage);
		const hitstun = readValue(c.props["ground.hittime"]);
		const blockstun = readValue(c.props["guard.hittime"]);
		const fall = readValue(c.props.fall);
		// fall.recover / down.recover default to 1. Soft: the victim can air-
		// recover; medium: can't air-recover but can get up early; hard: neither.
		const recover = (key) => {
			const v = readValue(c.props[key]);
			return v.raw == null ? 1 : (v.value ?? v.raw);
		};
		const airRecover = recover("fall.recover");
		const downRecover = recover("down.recover");
		const kdType =
			typeof airRecover === "string" || typeof downRecover === "string"
				? `depends: fall.recover = ${airRecover}, down.recover = ${downRecover}`
				: !airRecover && !downRecover
					? "hard"
					: !airRecover
						? "medium"
						: "soft";
		const adv = (stun) =>
			stun.value == null || out.statetype === "A"
				? null
				: stun.value - (total - contact);
		return {
			line: `${st.file}:${c.line}`,
			trigger: trig,
			// Fires only if an earlier hit missed: an alternate hitbox, not an extra hit.
			alternate: /!\s*(movecontact|movehit)/i.test(trig),
			// Only when entered from a particular state (a sidestep attack, a
			// follow-up): the move used in another context, not a hit of its own.
			context: trig.match(/\bprevstateno\s*!?=\s*[^&|)]+/i)?.[0].trim() ?? null,
			// Fires only after an earlier hit connected: a follow-up.
			followup:
				/(^|[^!])\b(movecontact|movehit)\b/i.test(trig) &&
				!/!\s*(movecontact|movehit)/i.test(trig),
			from,
			frame: contact + 1,
			damage: damage.value ?? damage.raw,
			guard: guardName(c.props.guardflag),
			knockdown: fall.value == null ? fall.raw : fall.value > 0,
			knockdownType: fall.value > 0 ? kdType : null,
			hitstun: hitstun.value ?? hitstun.raw,
			blockstun: blockstun.value ?? blockstun.raw,
			onHit: adv(hitstun),
			onBlock: adv(blockstun),
		};
	});
	/* Controllers run before hit detection, so an alternate switched on by
	   the time the earlier HitDef's hitbox first appears has already
	   replaced it: the earlier one never lands, and the alternate is the hit. */
	out.hits.forEach((alt, i) => {
		if (!alt.alternate) return;
		const before = out.hits
			.slice(0, i)
			.findLast((h) => !h.alternate && !h.context && !h.superseded);
		if (before && alt.from > before.from && alt.from <= before.frame - 1) {
			before.superseded = true;
			alt.alternate = false;
			alt.replaces = before.line;
		}
	});
	const main = out.hits.filter(
		(h) => !h.alternate && !h.context && !h.superseded,
	);
	out.damage = main.map((h) => h.damage).join("+");
	const last = main.at(-1) ?? out.hits[0];
	if (last) {
		out.guard = [...new Set(main.map((h) => h.guard))].join("/");
		// Past the animation the state's length isn't known, so neither is
		// the advantage; leave it for the engine rather than print a guess.
		out.onBlock = animEnd ? last.onBlock : null;
		out.onHit = last.knockdown === true ? "KD" : animEnd ? last.onHit : null;
	}
	if (projectiles.length)
		out.warnings.push(`fires ${projectiles.length} Projectile controller(s)`);
	if (attackHelpers.length) {
		out.warnings.push(
			`spawns helper state(s) that attack: ${attackHelpers.map((c) => readValue(c.props.stateno).value).join(", ")}`,
		);
	}
	const unresolved = out.hits.flatMap((h) =>
		["damage", "hitstun", "blockstun"]
			.filter((k) => typeof h[k] === "string")
			.map((k) => `${k}: ${h[k]}`),
	);
	if (unresolved.length)
		out.warnings.push(`unevaluated (pass --set?): ${unresolved.join("; ")}`);
	return out;
}

/** Every trigger elsewhere that names this state as the character's own
 *  current state - cancel rules, chains, follow-ups - with the controller it
 *  sits in. `range` marks a `stateno = [a, b]` match: broad rules that
 *  apply to many moves at once (custom combo, "any normal"), less telling
 *  than a rule that names the state outright. */
function referencesTo(id) {
	const refs = [];
	// Not p2stateno / prevstateno / enemy's: the character's own state only.
	const own = String.raw`(?<![\w,]\s*)(?<!\w)stateno`;
	for (const st of allStates) {
		if (st.id === id) continue;
		for (const c of st.ctrls) {
			for (const t of c.triggers) {
				const v = t.value;
				const exact = new RegExp(`${own}\\s*=\\s*${id}(?!\\d)`, "i").test(v);
				const range = [
					...v.matchAll(
						new RegExp(
							`${own}\\s*=\\s*\\[\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\]`,
							"gi",
						),
					),
				].some(([, a, b]) => id >= Number(a) && id <= Number(b));
				if (exact || range) {
					refs.push({
						range: !exact,
						where: `${st.file}:${t.line}`,
						in: `Statedef ${st.id} / [State ${c.name}] (${typeOf(c)}${c.props.map ? ` ${c.props.map}` : ""}${c.props.value ? ` -> ${c.props.value}` : ""})`,
						trigger: `${t.key} = ${v.trim()}`,
					});
				}
			}
		}
	}
	return refs;
}

// ------------------------------------------------------------------ output
const results = allStates
	.filter((s) => inRange(s.id))
	.map(analyse)
	.filter(Boolean);
if (flag("refs")) for (const r of results) r.refs = referencesTo(r.id);

const sign = (v) =>
	typeof v === "number" ? (v > 0 ? `+${v}` : String(v)) : (v ?? "-");

if (flag("json")) {
	console.log(
		JSON.stringify(
			{
				character: defFile,
				files: stateFiles,
				zss: zssFiles,
				maps,
				moves: results,
			},
			null,
			2,
		),
	);
} else if (flag("markdown")) {
	console.log(
		"| Move | Damage | Guard | Block<br>Stun | Hit<br>Stun | Notes | Frame Data |",
	);
	console.log("|---|:-:|:-:|:-:|:-:|:-:|---|");
	for (const r of results) {
		const notes =
			[
				r.hits?.some((h) => h.alternate) && "alt hit",
				r.hits?.some((h) => h.context) && "context hit",
			]
				.filter(Boolean)
				.join(", ") || "-";
		console.log(
			`| ${r.name || r.id} | ${r.damage ?? "?"} | ${r.guard ?? "?"} | ${sign(r.onBlock)} | ${sign(r.onHit)} | ${notes} | ${r.frames ?? ""} |`,
		);
	}
} else {
	if (zssFiles.length)
		console.log(`note: not parsed (ZSS): ${zssFiles.join(", ")}\n`);
	for (const r of results) {
		console.log(
			`${r.id}  ${r.name}  [${r.where}, anim ${r.anim}, type ${r.statetype}]`,
		);
		if (r.frames)
			console.log(
				`  ${r.frames}  (total ${r.total}; real active frames ${r.activeFrames})`,
			);
		if (r.hits?.length) {
			console.log(
				`  damage ${r.damage}  guard ${r.guard}  block ${sign(r.onBlock)}  hit ${sign(r.onHit)}`,
			);
			for (const h of r.hits) {
				const tag = h.superseded
					? " NEVER LANDS (replaced before contact)"
					: h.replaces
						? " REPLACES the hit above"
						: h.alternate
							? " ALTERNATE"
							: h.context
								? ` ONLY WHEN ${h.context}`
								: h.followup
									? " FOLLOW-UP"
									: "";
				console.log(
					`    hit @f${h.frame}${tag}: dmg ${h.damage}, ${h.guard}, hitstun ${h.hitstun}, blockstun ${h.blockstun}${h.knockdown === true ? `, knockdown (${h.knockdownType})` : ""}  [${h.trigger}]`,
				);
			}
		}
		for (const w of r.warnings) console.log(`  ! ${w}`);
		const refs = r.refs || [];
		for (const ref of refs.filter((x) => !x.range)) {
			console.log(`  ref ${ref.where}  ${ref.in}  ${ref.trigger}`);
		}
		const ranged = refs.filter((x) => x.range);
		if (ranged.length) {
			console.log(
				"  range refs (rules covering many states, --json for detail):",
			);
			for (const name of [...new Set(ranged.map((x) => x.in))])
				console.log(`    ${name}`);
		}
		console.log("");
	}
}
