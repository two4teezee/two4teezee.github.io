/**
 * Shared loading for extract.mjs and trace.mjs: the character's .def, its
 * animations (.air) and its states (.cns / .st). ZSS files are listed but not
 * parsed.
 */
import fs from "node:fs";
import path from "node:path";

// --------------------------------------------------------------------- .air
/** Each action is an array of elements { ticks, hit, reach } with a
 *  `loopStart` index. `hit` is whether the element has a Clsn1; `reach` is
 *  the furthest forward edge of those boxes (facing right), for distance
 *  checks. */
export function parseAir(text) {
	const actions = {};
	let frames = null;
	let clsn1Default = null;
	let clsn1Next = null;
	let reading = null; // which list Clsn1[n] lines go to
	for (let line of text.split(/\r?\n/)) {
		line = line.replace(/;.*/, "").trim();
		if (!line) continue;
		const begin = line.match(/^\[Begin Action\s+(-?\d+)\]/i);
		if (begin) {
			frames = actions[begin[1]] = [];
			frames.loopStart = 0;
			clsn1Default = null;
			clsn1Next = null;
			reading = null;
			continue;
		}
		if (!frames) continue;
		const clsn1 = line.match(/^Clsn1(Default)?\s*:\s*(\d+)/i);
		if (clsn1) {
			const boxes = Number(clsn1[2]) > 0 ? [] : null;
			if (clsn1[1]) clsn1Default = boxes;
			else clsn1Next = boxes;
			reading = boxes;
			continue;
		}
		const box = line.match(/^Clsn1\s*\[\s*\d+\s*\]\s*=\s*(.*)$/i);
		if (box) {
			reading?.push(box[1].split(",").map(Number));
			continue;
		}
		if (/^Clsn2/i.test(line)) {
			reading = null;
			continue;
		}
		if (/^loopstart/i.test(line)) {
			frames.loopStart = frames.length;
			continue;
		}
		if (/^(Clsn|Interpolate)/i.test(line)) continue;
		const parts = line.split(",").map((s) => s.trim());
		if (parts.length >= 5 && /^-?\d+$/.test(parts[0])) {
			const boxes = clsn1Next ?? clsn1Default;
			frames.push({
				ticks: Number(parts[4]),
				hit: !!boxes,
				reach: boxes?.length
					? Math.max(...boxes.map(([x1, , x2]) => Math.max(x1, x2)))
					: null,
			});
			clsn1Next = null;
			reading = null;
		}
	}
	return actions;
}

// ------------------------------------------------------------------ states
export function parseStates(text, file) {
	const states = [];
	let comment = "";
	let st = null;
	let ctrl = null;
	text.split(/\r?\n/).forEach((raw, index) => {
		const header = raw.match(/^\s*;=*<([^>]+)>=*/);
		if (header) comment = header[1].trim();
		const line = raw.replace(/;.*/, "").trim();
		const sd = line.match(/^\[Statedef\s+(-?\d+)/i);
		if (sd) {
			st = {
				id: Number(sd[1]),
				name: comment,
				file,
				line: index + 1,
				props: {},
				ctrls: [],
			};
			states.push(st);
			ctrl = null;
			return;
		}
		if (!st) return;
		const sc = line.match(/^\[State\s+([^\]]*)\]/i);
		if (sc) {
			ctrl = { name: sc[1].trim(), line: index + 1, props: {}, triggers: [] };
			st.ctrls.push(ctrl);
			return;
		}
		const kv = line.match(/^([\w.()]+)\s*=\s*(.*)$/);
		if (!kv) return;
		const key = kv[1].toLowerCase();
		if (ctrl) {
			if (/^trigger/.test(key))
				ctrl.triggers.push({ key, value: kv[2], line: index + 1 });
			else ctrl.props[key] ??= kv[2];
		} else st.props[key] ??= kv[2];
	});
	return states;
}

/** `[Data]`, `[Size]`, `[Velocity]`, `[Movement]` constants, keyed the way
 *  `const(...)` names them: `movement.yaccel`, `velocity.walk.fwd.x`. */
export function parseConstants(text) {
	const out = {};
	let section = null;
	for (let line of text.split(/\r?\n/)) {
		line = line.replace(/;.*/, "").trim();
		const head = line.match(/^\[(\w+)\]$/);
		if (head) {
			section = head[1].toLowerCase();
			continue;
		}
		if (/^statedef/i.test(line) || line.startsWith("[")) section = null;
		if (!["data", "size", "velocity", "movement"].includes(section)) continue;
		const kv = line.match(/^([\w.]+)\s*=\s*(.*)$/);
		if (!kv) continue;
		const key = `${section}.${kv[1].toLowerCase()}`;
		const nums = kv[2].split(",").map((s) => Number(s.trim()));
		out[key] = nums[0];
		if (nums.length > 1) {
			out[`${key}.x`] = nums[0];
			out[`${key}.y`] = nums[1];
		}
	}
	return out;
}

/** The n-th comma-separated argument of a value, respecting parentheses. */
export function argument(value, n = 0) {
	if (value == null) return null;
	const text = String(value).replace(/;.*/, "");
	const out = [];
	let depth = 0;
	let cur = "";
	for (const ch of text) {
		if (ch === "(" || ch === "[") depth++;
		if (ch === ")" || ch === "]") depth--;
		if (ch === "," && depth === 0) {
			out.push(cur);
			cur = "";
		} else cur += ch;
	}
	out.push(cur);
	return out[n]?.trim() ?? null;
}

// ---------------------------------------------------------------- character
export function loadCharacter(dir) {
	// MUGEN files are usually Shift-JIS or Latin-1; only ASCII matters here.
	const read = (file) => fs.readFileSync(path.join(dir, file), "latin1");
	const exists = (file) => fs.existsSync(path.join(dir, file));
	const defFile = fs.readdirSync(dir).find((f) => /\.def$/i.test(f));
	const def = read(defFile);
	const files = [
		...def.matchAll(
			/^\s*(st\d*|stcommon|cmd|cns|anim|movelist)\s*=\s*([^;\r\n]+)/gim,
		),
	].map((m) => ({ key: m[1].toLowerCase(), file: m[2].trim() }));
	const fileOf = (key) => files.find((f) => f.key === key)?.file;
	const air = parseAir(read(fileOf("anim")));
	const stateFiles = files
		.filter((f) => /^(st\d*|cmd|cns)$/.test(f.key) && exists(f.file))
		.map((f) => f.file);
	const zssFiles = stateFiles.filter((f) => /\.zss$/i.test(f));
	const allStates = stateFiles
		.filter((f) => !/\.zss$/i.test(f))
		.flatMap((f) => parseStates(read(f), f));
	const byId = new Map();
	// The first definition wins, as in the engine.
	for (const s of allStates) if (!byId.has(s.id)) byId.set(s.id, s);
	const constants = fileOf("cns") ? parseConstants(read(fileOf("cns"))) : {};
	return {
		defFile,
		files,
		fileOf,
		air,
		stateFiles,
		zssFiles,
		allStates,
		byId,
		constants,
		read,
	};
}
