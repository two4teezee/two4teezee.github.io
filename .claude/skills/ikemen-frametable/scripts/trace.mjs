#!/usr/bin/env node
/**
 * Tick-by-tick trace of one move, from the state its command enters to the
 * frame the character can act again - through hops, dashes, landings, super
 * pauses and the helpers it spawns.
 *
 *   node trace.mjs <char dir> <state> [--set name=value ...] [--pin name=value ...]
 *                  [--scenario whiff|block|hit|all] [--distance px]
 *                  [--command name,...] [--power n] [--max ticks]
 *                  [--height px] [--vel x,y] [--p2 S|C|A] [--screen-ground y]
 *                  [--no-negstates]
 *                  [--ticks] [--json]
 *
 * --height / --vel start the move in the air (an air special): the height
 * above the ground and the velocity it's input with.
 *
 * It runs the character on their own: the state's controllers each tick
 * (ChangeState, ChangeAnim, VelSet/VelAdd/PosSet/PosAdd, StateTypeSet,
 * CtrlSet, MapSet/VarSet, HitDef, NotHitBy, SuperPause, Helper, ...), then
 * velocity, gravity (physics A) and the landing check, then the animation.
 * There is no opponent: triggers that ask about one (movecontact, movehit,
 * numtarget, p2bodydist ...) answer from the scenario -
 *   whiff  nothing connects
 *   block  each HitDef connects, guarded, on its first active frame
 *   hit    each HitDef connects, on its first active frame
 * With --distance (pixels between the two bodies) a hitbox only connects
 * once it reaches that far, which is what a projectile's startup needs.
 * Hitpause is not simulated: frame counts exclude it, as frame data does.
 *
 * Conventions match extract.mjs: tick 0 is the input frame, startup counts
 * up to and including the first active frame, advantage = stun - (frames
 * from contact to the first actionable frame).
 */
import { argument, loadCharacter } from "./lib.mjs";

// ---------------------------------------------------------------- arguments
const args = process.argv.slice(2);
const positional = args.filter(
	(a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"),
);
const [dir, startArg] = positional;
if (!dir || startArg == null) {
	console.error(
		"usage: node trace.mjs <char dir> <state> [--set k=v] [--pin k=v] [--scenario whiff|block|hit|all] [--distance px] [--command a,b] [--ticks] [--json]",
	);
	process.exit(1);
}
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
	const i = args.indexOf(`--${name}`);
	return i === -1 ? undefined : args[i + 1];
};
const pairs = (name) => {
	const out = {};
	args.forEach((a, i) => {
		if (args[i - 1] === `--${name}`) {
			const [k, v] = a.split("=");
			out[k.toLowerCase()] = Number(v);
		}
	});
	return out;
};
const SETS = pairs("set");
const PINS = pairs("pin");
const COMMANDS = new Set(
	(option("command") || "")
		.split(",")
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean),
);
const SCREEN_GROUND =
	option("screen-ground") != null ? Number(option("screen-ground")) : null;
const DISTANCE = option("distance") != null ? Number(option("distance")) : null;
const POWER = Number(option("power") ?? 3000);
const MAX = Number(option("max") ?? 600);
const scenarioArg = option("scenario") || "all";
const SCENARIOS =
	scenarioArg === "all" ? ["whiff", "block", "hit"] : [scenarioArg];

const ch = loadCharacter(dir);
const { air, byId, constants } = ch;

// ------------------------------------------------------------- expressions
class Unknown extends Error {
	constructor(what) {
		super(what);
		this.what = what;
	}
}

const TOKEN =
	/\s*(?:(\d+\.\d*|\.\d+|\d+)|"([^"]*)"|([A-Za-z_][\w.]*)|(:=|\|\||\^\^|&&|!=|<=|>=|\*\*|[=<>+\-*/%!~&|^()[\],]))/y;
function tokenize(src) {
	const out = [];
	TOKEN.lastIndex = 0;
	let pos = 0;
	while (pos < src.length) {
		TOKEN.lastIndex = pos;
		const m = TOKEN.exec(src);
		if (!m || m[0].trim() === "") {
			if (/^\s*$/.test(src.slice(pos))) break;
			out.push({ t: "?", v: src[pos] });
			pos++;
			continue;
		}
		pos = TOKEN.lastIndex;
		if (m[1] != null)
			out.push({ t: "num", v: Number(m[1]), float: /\./.test(m[1]) });
		else if (m[2] != null) out.push({ t: "str", v: m[2] });
		else if (m[3] != null) out.push({ t: "id", v: m[3].toLowerCase() });
		else out.push({ t: "op", v: m[4] });
	}
	return out;
}

const AXIS = new Set([
	"pos",
	"vel",
	"p2bodydist",
	"p2dist",
	"screenpos",
	"rootdist",
	"parentdist",
	"p1dist",
	"p2pos",
]);
const REDIRECT = new Set([
	"parent",
	"root",
	"helper",
	"target",
	"partner",
	"enemy",
	"enemynear",
	"playerid",
	"p2",
]);
const SWALLOW = new Set([
	"hitdefattr",
	"reversaldefattr",
	"projcontact",
	"projhit",
	"projguarded",
	"timemod",
]);

function parse(src) {
	const toks = tokenize(src);
	let i = 0;
	const peek = (o = 0) => toks[i + o];
	const isOp = (v, o = 0) => peek(o)?.t === "op" && peek(o).v === v;
	const take = () => toks[i++];
	const expect = (v) => {
		if (!isOp(v)) throw new SyntaxError(`expected ${v} in ${src}`);
		i++;
	};
	const binary = (next, ops) => () => {
		let l = next();
		while (peek()?.t === "op" && ops.includes(peek().v)) {
			const op = take().v;
			l = { k: "bin", op, l, r: next() };
		}
		return l;
	};
	const unary = () => {
		if (isOp("!") || isOp("-") || isOp("~") || isOp("+")) {
			const op = take().v;
			return { k: "un", op, e: unary() };
		}
		return power();
	};
	const power = () => {
		const l = primary();
		if (isOp("**")) {
			take();
			return { k: "bin", op: "**", l, r: unary() };
		}
		return l;
	};
	const mul = binary(unary, ["*", "/", "%"]);
	const add = binary(mul, ["+", "-"]);
	const rel = binary(add, ["<", "<=", ">", ">="]);
	const eq = () => {
		const l = rel();
		if (l.k === "id" && SWALLOW.has(l.name)) {
			i = toks.length;
			return { k: "unknown", name: l.name };
		}
		if (!(isOp("=") || isOp("!="))) return l;
		const op = take().v;
		// interval: = [a, b] / (a, b] ...
		if (isOp("[") || isOp("(")) {
			const save = i;
			const open = take().v;
			const lo = or();
			if (isOp(",")) {
				take();
				const hi = or();
				if (isOp("]") || isOp(")")) {
					const close = take().v;
					return { k: "range", op, l, lo, hi, open, close };
				}
			}
			i = save;
		}
		const r = rel();
		// animelem = k, op v
		if (l.k === "id" && l.name === "animelem" && isOp(",")) {
			take();
			let cmp = "=";
			if (
				peek()?.t === "op" &&
				["=", "!=", "<", "<=", ">", ">="].includes(peek().v)
			)
				cmp = take().v;
			return { k: "elem", neg: op === "!=", elem: r, cmp, v: rel() };
		}
		if (l.k === "id" && l.name === "animelem")
			return {
				k: "elem",
				neg: op === "!=",
				elem: r,
				cmp: "=",
				v: { k: "num", v: 0 },
			};
		return { k: "bin", op, l, r };
	};
	const band = binary(eq, ["&"]);
	const bxor = binary(band, ["^"]);
	const bor = binary(bxor, ["|"]);
	const and = binary(bor, ["&&"]);
	const xor = binary(and, ["^^"]);
	const or = binary(xor, ["||"]);
	function primary() {
		const tk = take();
		if (!tk) throw new SyntaxError(`unexpected end in ${src}`);
		if (tk.t === "num") return { k: "num", v: tk.v, float: tk.float };
		if (tk.t === "str") return { k: "str", v: tk.v };
		if (tk.t === "op" && tk.v === "(") {
			const e = or();
			expect(")");
			return e;
		}
		if (tk.t !== "id") return { k: "unknown", name: tk.v };
		const name = tk.v;
		let argsList = null;
		if (isOp("(")) {
			take();
			argsList = [];
			if (!isOp(")")) {
				do {
					if (
						peek()?.t === "id" &&
						(isOp(",", 1) || isOp(")", 1)) &&
						!isOp("(", 1)
					) {
						// bare name argument: map(x), const(size.ground.front)
						const id = take().v;
						argsList.push({ k: "name", v: id });
					} else argsList.push(or());
				} while (isOp(",") && take());
			}
			expect(")");
		}
		if (REDIRECT.has(name) && isOp(",")) {
			take();
			return { k: "redir", who: name, args: argsList, e: unary() };
		}
		let axis = null;
		if (AXIS.has(name) && peek()?.t === "id" && /^[xyz]$/.test(peek().v))
			axis = take().v;
		const node = { k: "id", name, args: argsList, axis };
		if (
			isOp(":=") &&
			["map", "var", "fvar", "sysvar", "sysfvar"].includes(name)
		) {
			take();
			return { k: "assign", target: node, e: add() };
		}
		return node;
	}
	const e = or();
	if (i < toks.length) throw new SyntaxError(`trailing tokens in ${src}`);
	return e;
}

const parsed = new Map();
const compile = (src) => {
	const key = String(src).replace(/;.*/, "").trim();
	if (!parsed.has(key)) {
		try {
			parsed.set(key, parse(key));
		} catch (err) {
			parsed.set(key, { k: "unknown", name: `syntax: ${err.message}` });
		}
	}
	return parsed.get(key);
};

const truthy = (v) => (typeof v === "string" ? v.length > 0 : v !== 0);
const num = (b) => (b ? 1 : 0);
const LETTERS = /^[scalihpnu]{1,3}$/;

// ------------------------------------------------------------------ the sim
class Sim {
	constructor(scenario) {
		this.scenario = scenario;
		this.g = 0;
		this.chars = [];
		this.pause = null; // { start, end, movetime, by }
		this.hits = [];
		this.unknown = new Map();
		this.assumed = new Set();
		this.nextId = 57;
		this.events = [];
		this.unsetMaps = new Set();
		this.globalUnknown = new Set();
	}
}

class Char {
	constructor(
		sim,
		{
			parent = null,
			stateNo,
			x = 0,
			y = 0,
			id = 0,
			facing = 1,
			superMove = 0,
			pauseMove = 0,
		},
	) {
		this.sim = sim;
		this.parent = parent;
		this.root = parent ? parent.root : this;
		this.helperId = id;
		this.playerId = parent ? sim.nextId++ : 56;
		this.pos = { x, y };
		this.vel = { x: 0, y: 0 };
		this.facing = facing;
		this.maps = parent ? {} : { ...SETS };
		this.vars = {};
		this.fvars = {};
		this.sysvars = {};
		this.ctrl = parent ? 0 : 0;
		this.statetype = "S";
		this.movetype = "I";
		this.physics = "S";
		this.prevmovetype = "I";
		this.stateNo = null;
		this.prevStateNo = 0;
		this.time = 0;
		this.anim = 0;
		this.elapsed = 0;
		this.hitdef = null;
		this.reversal = null;
		this.contact = null; // { tick, hit, guarded }
		this.hitCount = 0;
		this.targets = 0;
		this.invulnUntil = -1;
		this.invulnAttr = "";
		this.alive = true;
		this.superMove = superMove;
		this.pauseMove = pauseMove;
		this.persist = new Map();
		this.pendingState = null;
		this.log = [];
		this.changeState(stateNo);
	}

	// ----- animation
	frames() {
		return air[String(this.anim)] || null;
	}
	animLength() {
		const f = this.frames();
		if (!f) return 0;
		if (f.some((e) => e.ticks < 0)) return Number.POSITIVE_INFINITY;
		return f.reduce((s, e) => s + e.ticks, 0);
	}
	animPos(offset = 0) {
		const f = this.frames();
		if (!f) return 0;
		const L = this.animLength();
		const t = this.elapsed + offset;
		if (t < L || L === Number.POSITIVE_INFINITY) return t;
		const loopAt = f.slice(0, f.loopStart).reduce((s, e) => s + e.ticks, 0);
		return loopAt + ((t - L) % Math.max(1, L - loopAt));
	}
	elemStart(k) {
		const f = this.frames() || [];
		let s = 0;
		for (let j = 0; j < k - 1 && j < f.length; j++)
			s += Math.max(0, f[j].ticks);
		return s;
	}
	elemAt(offset = 0) {
		const f = this.frames();
		if (!f?.length) return { index: 0, frame: null };
		let p = this.animPos(offset);
		for (let j = 0; j < f.length; j++) {
			if (f[j].ticks < 0 || p < f[j].ticks) return { index: j, frame: f[j] };
			p -= f[j].ticks;
		}
		return { index: f.length - 1, frame: f.at(-1) };
	}
	setAnim(n, elem = 1) {
		this.anim = n;
		this.elapsed = 0;
		if (elem > 1) this.elapsed = this.elemStart(elem);
		if (!air[String(n)])
			this.sim.events.push(`${this.label()}: anim ${n} not found`);
	}
	label() {
		return this.parent ? `helper ${this.helperId}` : "P1";
	}

	// ----- state changes
	changeState(no, ctrlArg, animArg) {
		const st = byId.get(no);
		if (!st) {
			this.sim.events.push(
				`${this.label()}: state ${no} not found (ZSS or common?)`,
			);
			this.alive = false;
			return;
		}
		this.prevStateNo = this.stateNo ?? 0;
		this.stateNo = no;
		this.time = 0;
		this.persist = new Map();
		const p = st.props;
		const letter = (v, dflt) => {
			const s = (v ?? dflt).trim().toUpperCase()[0];
			return s === "U" ? null : s;
		};
		this.prevmovetype = this.movetype;
		this.statetype = letter(p.type, "S") ?? this.statetype;
		this.movetype = letter(p.movetype, "I") ?? this.movetype;
		this.physics = letter(p.physics, "N") ?? this.physics;
		if (!truthy(this.num(p.hitdefpersist, 0) ?? 0)) this.hitdef = null;
		if (!truthy(this.num(p.movehitpersist, 0) ?? 0)) this.contact = null;
		if (!truthy(this.num(p.hitcountpersist, 0) ?? 0)) this.hitCount = 0;
		if (p.anim != null) {
			const a = this.num(p.anim);
			if (a != null) this.setAnim(a);
		}
		if (p.ctrl != null) this.ctrl = this.num(p.ctrl) ?? this.ctrl;
		if (p.velset != null) {
			this.vel.x = this.num(p.velset, 0) ?? this.vel.x;
			this.vel.y = this.num(p.velset, 1) ?? this.vel.y;
		}
		if (ctrlArg != null) this.ctrl = ctrlArg;
		if (animArg != null) this.setAnim(animArg);
		this.log.push({ tick: this.sim.g, state: no });
	}

	// ----- expression evaluation
	num(raw, n = 0) {
		if (raw == null) return null;
		const arg = argument(raw, n);
		if (arg == null || arg === "") return null;
		try {
			const v = this.eval(compile(arg));
			return typeof v === "number" ? v : null;
		} catch (e) {
			if (e instanceof Unknown) return null;
			throw e;
		}
	}
	str(raw) {
		return raw == null ? "" : String(raw).replace(/;.*/, "").trim();
	}
	eval(node) {
		switch (node.k) {
			case "num":
				return node.v;
			case "str":
				return node.v;
			case "name":
				return node.v;
			case "unknown":
				throw new Unknown(node.name);
			case "un": {
				const v = this.eval(node.e);
				if (node.op === "!") return num(!truthy(v));
				if (node.op === "-") return -v;
				if (node.op === "~") return ~v;
				return v;
			}
			case "assign": {
				const v = this.eval(node.e);
				const t = node.target;
				const key = t.args?.[0];
				const name =
					key.k === "name" || key.k === "str" ? key.v : this.eval(key);
				const store = {
					map: this.maps,
					var: this.vars,
					fvar: this.fvars,
					sysvar: this.sysvars,
					sysfvar: this.sysvars,
				}[t.name];
				if (t.name === "map" && PINS[String(name).toLowerCase()] != null)
					return v;
				store[String(name).toLowerCase()] = v;
				return v;
			}
			case "redir":
				return this.redirect(node).eval(node.e);
			case "range": {
				const v = this.eval(node.l);
				const lo = this.eval(node.lo);
				const hi = this.eval(node.hi);
				const inside =
					(node.open === "[" ? v >= lo : v > lo) &&
					(node.close === "]" ? v <= hi : v < hi);
				return num(node.op === "=" ? inside : !inside);
			}
			case "elem": {
				const k = this.eval(node.elem);
				const f = this.frames() || [];
				if (k > f.length) return num(node.neg);
				const t = this.animPos() - this.elemStart(k);
				const v = this.eval(node.v);
				const cmp = {
					"=": t === v,
					"!=": t !== v,
					"<": t < v,
					"<=": t <= v,
					">": t > v,
					">=": t >= v,
				}[node.cmp];
				// animelem = k alone also needs element k to be the current one
				const here =
					node.cmp !== "=" || this.elemAt().index === k - 1 || t === v;
				return num((cmp && here) !== node.neg);
			}
			case "bin":
				return this.binary(node);
			case "id":
				return this.trigger(node);
		}
		throw new Unknown(`node ${node.k}`);
	}
	binary({ op, l, r }) {
		if (op === "&&" || op === "||") {
			// Both sides are evaluated (their := assignments happen), but an
			// unknown on the right doesn't matter when the left decides.
			const a = truthy(this.eval(l));
			let b;
			try {
				b = truthy(this.eval(r));
			} catch (e) {
				if (e instanceof Unknown && (op === "&&" ? !a : a)) return num(a);
				throw e;
			}
			return num(op === "&&" ? a && b : a || b);
		}
		if (l.k === "id" && l.name === "command" && (op === "=" || op === "!=")) {
			const has = COMMANDS.has(String(this.eval(r)).toLowerCase());
			return num(op === "=" ? has : !has);
		}
		const a = this.eval(l);
		const b = this.eval(r);
		switch (op) {
			case "^^":
				return num(truthy(a) !== truthy(b));
			case "|":
				return a | b;
			case "^":
				return a ^ b;
			case "&":
				return a & b;
			case "=":
				return num(
					typeof a === "string" || typeof b === "string"
						? String(a).toUpperCase() === String(b).toUpperCase()
						: a === b,
				);
			case "!=":
				return num(
					typeof a === "string" || typeof b === "string"
						? String(a).toUpperCase() !== String(b).toUpperCase()
						: a !== b,
				);
			case "<":
				return num(a < b);
			case "<=":
				return num(a <= b);
			case ">":
				return num(a > b);
			case ">=":
				return num(a >= b);
			case "+":
				return a + b;
			case "-":
				return a - b;
			case "*":
				return a * b;
			case "/":
				if (b === 0) return 0;
				return Number.isInteger(a) &&
					Number.isInteger(b) &&
					!l.float &&
					!r.float
					? Math.trunc(a / b)
					: a / b;
			case "%":
				return b === 0 ? 0 : a % b;
			case "**":
				return a ** b;
		}
		throw new Unknown(`operator ${op}`);
	}
	redirect(node) {
		const arg = node.args?.[0] ? this.eval(node.args[0]) : null;
		switch (node.who) {
			case "parent":
				if (this.parent) return this.parent;
				break;
			case "root":
				return this.root;
			case "helper": {
				const h = this.sim.chars.find(
					(c) => c.parent && c.alive && (arg == null || c.helperId === arg),
				);
				if (h) return h;
				break;
			}
			case "playerid": {
				const h = this.sim.chars.find((c) => c.alive && c.playerId === arg);
				if (h) return h;
				break;
			}
			case "p2":
			case "enemy":
			case "enemynear":
				return opponent(this.sim);
			case "target":
				if (this.targets) return opponent(this.sim);
				break;
		}
		throw new Unknown(`${node.who},`);
	}
	assume(name, value) {
		if (!(this === this.root && this.sim.rootDone != null))
			this.sim.assumed.add(name);
		return value;
	}
	trigger({ name, args: a, axis }) {
		const arg = (n) => {
			const node = a?.[n];
			if (!node) return null;
			return node.k === "name" ? node.v : this.eval(node);
		};
		const sim = this.sim;
		const front = constants["size.ground.front"] ?? 16;
		const bodyDist =
			(DISTANCE ?? 0) -
			this.root.pos.x +
			(this.root === this ? 0 : this.root.pos.x - this.pos.x);
		switch (name) {
			case "time":
			case "statetime":
				return this.time;
			case "stateno":
				return this.stateNo;
			case "prevstateno":
				return this.prevStateNo;
			case "anim":
				return this.anim;
			case "animtime":
				return this.animLength() === Number.POSITIVE_INFINITY
					? -1
					: this.animPos() - (this.animLength() - 1);
			case "animelemtime":
				return this.animPos() - this.elemStart(arg(0));
			case "animelemno":
				return this.elemAt(arg(0) ?? 0).index + 1;
			case "animexist":
			case "selfanimexist":
				return num(!!air[String(arg(0))]);
			case "statetype":
				return this.statetype;
			case "movetype":
				return this.movetype;
			case "prevmovetype":
				return this.prevmovetype;
			case "ctrl":
				return this.ctrl;
			case "pos":
				return axis === "y" ? this.pos.y : this.pos.x;
			case "vel":
				return axis === "y" ? this.vel.y : this.vel.x;
			case "facing":
				return this.facing;
			case "map": {
				const k = String(arg(0)).toLowerCase();
				const v = PINS[k] ?? this.maps[k];
				if (v != null) return v;
				// Read before anything set it: probably set in a ZSS file or a
				// negative state. Pass --set if 0 is wrong.
				if (!(this === this.root && this.ctrl)) sim.unsetMaps.add(k);
				return 0;
			}
			case "var":
				return this.vars[arg(0)] ?? 0;
			case "fvar":
				return this.fvars[arg(0)] ?? 0;
			case "sysvar":
			case "sysfvar":
				return this.sysvars[arg(0)] ?? 0;
			case "const": {
				const k = String(arg(0)).toLowerCase();
				if (k in constants) return constants[k];
				if (k === "size.xscale" || k === "size.yscale") return 1;
				throw new Unknown(`const(${k})`);
			}
			case "ifelse":
			case "cond":
				return truthy(arg(0)) ? arg(1) : arg(2);
			case "abs":
				return Math.abs(arg(0));
			case "floor":
				return Math.floor(arg(0));
			case "ceil":
				return Math.ceil(arg(0));
			case "min":
				return Math.min(arg(0), arg(1));
			case "max":
				return Math.max(arg(0), arg(1));
			case "clamp":
				return Math.min(Math.max(arg(0), arg(1)), arg(2));
			case "sin":
				return Math.sin(arg(0));
			case "cos":
				return Math.cos(arg(0));
			case "tan":
				return Math.tan(arg(0));
			case "exp":
				return Math.exp(arg(0));
			case "ln":
				return Math.log(arg(0));
			case "log":
				return Math.log(arg(1)) / Math.log(arg(0));
			case "sign":
				return Math.sign(arg(0));
			case "pi":
				return Math.PI;
			case "e":
				return Math.E;
			case "palno":
				return SETS.palno ?? 1;
			case "ailevel":
			case "ailevelf":
				return 0;
			case "roundstate":
				return 2;
			case "alive":
				return 1;
			case "life":
			case "lifemax":
				return 1000;
			case "power":
				return POWER;
			case "powermax":
				return 3000;
			case "gametime":
				return sim.g;
			case "random":
				return this.assume("random = 0", 0);
			case "ishelper":
				return num(
					!!this.parent && (arg(0) == null || this.helperId === arg(0)),
				);
			case "id":
			case "playerid":
				return this.playerId;
			case "parentid":
				return this.parent?.playerId ?? -1;
			case "playeridexist":
				return num(sim.chars.some((c) => c.alive && c.playerId === arg(0)));
			case "numhelper":
				return sim.chars.filter(
					(c) =>
						c.parent && c.alive && (arg(0) == null || c.helperId === arg(0)),
				).length;
			case "numexplod":
				return this.assume("numexplod = 0 (explods aren't simulated)", 0);
			case "numproj":
			case "numprojid":
				return 0;
			case "numenemy":
				return 1;
			case "numpartner":
				return 0;
			case "teamside":
				return 1;
			case "numtarget":
				return this.targets;
			case "movecontact":
				return this.contact ? sim.g - this.contact.tick : 0;
			case "movehit":
				return this.contact?.hit ? sim.g - this.contact.tick : 0;
			case "moveguarded":
				return this.contact?.guarded ? sim.g - this.contact.tick : 0;
			case "movereversed":
				return 0;
			case "hitcount":
			case "uniqhitcount":
				return this.hitCount;
			case "hitpausetime":
				return 0;
			case "hitshakeover":
			case "hitover":
				return 1;
			case "hitfall":
			case "inguarddist":
			case "isbound":
			case "dizzy":
			case "matchover":
				return 0;
			case "isasserted":
				return 0;
			case "gethitvar":
				return this.assume("gethitvar(...) = 0 (never hit)", 0);
			case "p2bodydist":
				return axis === "y" ? -this.pos.y : bodyDist;
			case "p2dist":
				return axis === "y" ? -this.pos.y : bodyDist + 2 * front;
			case "p2statetype":
				return P2_STATE;
			case "p2movetype":
				return this.root.targets ? "H" : "I";
			case "p2life":
				return 1000;
			case "frontedgedist":
			case "frontedgebodydist":
			case "backedgedist":
			case "backedgebodydist":
				return this.assume("mid-screen (edge distances = 160)", 160);
			case "command":
				return 0;
			case "screenpos":
				if (axis === "y" && SCREEN_GROUND != null)
					return this.assume(
						`floor at screen y ${SCREEN_GROUND}, camera still`,
						SCREEN_GROUND + this.pos.y,
					);
				break;
		}
		if (!a && !axis && LETTERS.test(name)) return name.toUpperCase();
		throw new Unknown(name + (a ? "(...)" : "") + (axis ? ` ${axis}` : ""));
	}

	// ----- controllers
	fires(c) {
		const groups = new Map();
		const all = [];
		for (const t of c.triggers) {
			if (t.key === "triggerall") all.push(t);
			else {
				const n = t.key.replace("trigger", "");
				if (!groups.has(n)) groups.set(n, []);
				groups.get(n).push(t);
			}
		}
		const test = (lines) => {
			for (const t of lines) {
				try {
					if (!truthy(this.eval(compile(t.value)))) return false;
				} catch (e) {
					if (!(e instanceof Unknown)) throw e;
					this.unknownAt(c, e.what);
					return false;
				}
			}
			return true;
		};
		if (!groups.size || !test(all)) return false;
		for (const lines of groups.values()) if (test(lines)) return true;
		return false;
	}
	unknownAt(c, what) {
		if (this === this.root && (this.sim.rootDone != null || this.ctrl)) return;
		// -2/-3 are the character's global rules; most of their unknowns are
		// about the opponent. Count them, don't list them.
		if (this.inGlobal) {
			this.sim.globalUnknown.add(`${c.line}`);
			return;
		}
		const type = (c.props.type || "").trim().toLowerCase();
		if (IGNORED.has(type)) return;
		const key = `${this.stateNo} [State ${c.name}] (${type}) line ${c.line}: ${what}`;
		const u = this.sim.unknown.get(key);
		if (u) u.count++;
		else this.sim.unknown.set(key, { count: 1, tick: this.sim.g });
	}
	process() {
		for (let loops = 0; loops < 16 && this.alive; loops++) {
			const st = byId.get(this.stateNo);
			if (!st) return;
			let changed = false;
			const states =
				!flag("no-negstates") && !this.parent && loops === 0
					? [byId.get(-3), byId.get(-2), st].filter(Boolean)
					: [st];
			for (const s of states) {
				this.inGlobal = s.id < 0;
				for (const c of s.ctrls) {
					if (!this.fires(c)) continue;
					const p = Number(this.num(c.props.persistent) ?? 1);
					const n = (this.persist.get(c) ?? 0) + 1;
					this.persist.set(c, n);
					if (p === 0 && n > 1) continue;
					if (p > 1 && (n - 1) % p !== 0) continue;
					if (this.apply(c) === "changed") {
						changed = true;
						break;
					}
				}
				if (changed) break;
			}
			if (!changed) return;
		}
	}
	apply(c) {
		const type = (c.props.type || "").trim().toLowerCase();
		const p = c.props;
		const sim = this.sim;
		switch (type) {
			case "changestate":
			case "selfstate": {
				const to = this.num(p.value);
				if (to == null) {
					this.unknownAt(c, `value = ${p.value}`);
					return;
				}
				this.changeState(to, this.num(p.ctrl), this.num(p.anim));
				return "changed";
			}
			case "changeanim":
			case "changeanim2": {
				const a = this.num(p.value);
				if (a == null) return this.unknownAt(c, `value = ${p.value}`);
				this.setAnim(a, this.num(p.elem) ?? 1);
				return;
			}
			case "velset":
				if (p.x != null) this.vel.x = this.num(p.x) ?? this.vel.x;
				if (p.y != null) this.vel.y = this.num(p.y) ?? this.vel.y;
				return;
			case "veladd":
				this.vel.x += this.num(p.x) ?? 0;
				this.vel.y += this.num(p.y) ?? 0;
				return;
			case "velmul":
				this.vel.x *= this.num(p.x) ?? 1;
				this.vel.y *= this.num(p.y) ?? 1;
				return;
			case "posset":
				if (p.x != null) this.pos.x = this.num(p.x) ?? this.pos.x;
				if (p.y != null) this.pos.y = this.num(p.y) ?? this.pos.y;
				return;
			case "posadd":
				this.pos.x += (this.num(p.x) ?? 0) * this.facing;
				this.pos.y += this.num(p.y) ?? 0;
				return;
			case "statetypeset": {
				const l = (v) => (v == null ? null : this.str(v).toUpperCase()[0]);
				this.statetype = l(p.statetype) ?? this.statetype;
				this.movetype = l(p.movetype) ?? this.movetype;
				this.physics = l(p.physics) ?? this.physics;
				return;
			}
			case "ctrlset":
				this.ctrl = this.num(p.value) ?? this.ctrl;
				return;
			case "mapset":
			case "mapadd":
			case "rootmapset":
			case "rootmapadd":
			case "parentmapset":
			case "parentmapadd": {
				const who = type.startsWith("root")
					? this.root
					: type.startsWith("parent")
						? (this.parent ?? this)
						: this;
				const k = this.str(p.map).replace(/"/g, "").toLowerCase();
				const v = this.num(p.value);
				if (v == null) return this.unknownAt(c, `value = ${p.value}`);
				if (PINS[k] != null) return;
				who.maps[k] = type.endsWith("add") ? (who.maps[k] ?? 0) + v : v;
				return;
			}
			case "varset":
			case "varadd": {
				for (const [key, raw] of Object.entries(p)) {
					const m = key.match(/^(var|fvar|sysvar|sysfvar)\((\d+)\)$/);
					const store = (kind) =>
						({
							var: this.vars,
							fvar: this.fvars,
							sysvar: this.sysvars,
							sysfvar: this.sysvars,
						})[kind];
					let kind = null;
					let idx = null;
					if (m) [kind, idx] = [m[1], Number(m[2])];
					else if (key === "v" || key === "fv")
						[kind, idx] = [key === "v" ? "var" : "fvar", this.num(raw)];
					if (!kind) continue;
					const v = this.num(m ? raw : p.value);
					if (v == null || idx == null) continue;
					const s = store(kind);
					s[idx] = type === "varadd" ? (s[idx] ?? 0) + v : v;
				}
				return;
			}
			case "hitdef":
				this.hitdef = this.snapshotHit(c);
				return;
			case "modifyhitdef":
				if (this.hitdef) Object.assign(this.hitdef, this.snapshotHit(c, true));
				return;
			case "reversaldef":
				this.reversal = { line: c.line, state: this.stateNo };
				return;
			case "hitoverride": {
				const t = this.num(p.time) ?? 1;
				this.override = { until: sim.g + t - 1, attr: this.str(p.attr) };
				return;
			}
			case "nothitby":
			case "hitby": {
				const t = this.num(p.time) ?? 1;
				const attr = this.str(p.value || p.value2)
					.split(",")[0]
					.toUpperCase();
				this.invulnUntil = sim.g + t - 1;
				// NotHitBy SCA = hit by nothing; HitBy X = hit only by X.
				this.invulnAttr = type === "nothitby" ? attr : `except ${attr}`;
				return;
			}
			case "superpause":
			case "pause": {
				if (this.parent) return;
				const t = this.num(p.time) ?? 30;
				const mt = this.num(p.movetime) ?? 0;
				sim.pause = { start: sim.g + 1, end: sim.g + t, movetime: mt, type };
				return;
			}
			case "helper": {
				const stateNo = this.num(p.stateno);
				if (stateNo == null) return this.unknownAt(c, `stateno = ${p.stateno}`);
				const postype = this.str(p.postype || "p1").toLowerCase();
				const ox = this.num(p.pos, 0) ?? 0;
				const oy = this.num(p.pos, 1) ?? 0;
				let base = this.pos;
				if (postype === "p2")
					base = {
						x: (DISTANCE ?? 0) + 2 * (constants["size.ground.front"] ?? 16),
						y: 0,
					};
				else if (postype !== "p1")
					sim.events.push(`helper ${stateNo}: postype ${postype} placed as p1`);
				const h = new Char(sim, {
					parent: this,
					stateNo,
					x: base.x + ox * this.facing,
					y: base.y + oy,
					id: this.num(p.id) ?? 0,
					facing: this.facing,
					superMove: this.num(p.supermovetime) ?? 0,
					pauseMove: this.num(p.pausemovetime) ?? 0,
				});
				h.spawned = sim.g;
				sim.chars.push(h);
				return;
			}
			case "destroyself":
				if (this.parent) this.alive = false;
				return;
			case "bindtoparent":
			case "bindtoroot": {
				const to = type === "bindtoroot" ? this.root : this.parent;
				if (!to) return;
				this.pos.x = to.pos.x + (this.num(p.pos, 0) ?? 0) * to.facing;
				this.pos.y = to.pos.y + (this.num(p.pos, 1) ?? 0);
				return;
			}
			case "turn":
				this.facing *= -1;
				return;
			case "targetlifeadd": {
				if (!this.targets) return;
				const v = this.num(p.value);
				sim.hits.push({
					tick: sim.g,
					who: this.label(),
					state: this.stateNo,
					throwDamage: v == null ? p.value : -v,
					line: c.line,
				});
				return;
			}
			case "null":
				return;
		}
	}
	snapshotHit(c, partial = false) {
		const p = c.props;
		const out = { line: c.line, state: this.stateNo };
		const take = (key, as, n = 0) => {
			if (p[key] == null) return;
			const v = this.num(p[key], n);
			out[as] = v ?? this.str(argument(p[key], n));
		};
		take("damage", "damage");
		take("ground.hittime", "hitstun");
		take("guard.hittime", "blockstun");
		take("fall", "fall");
		take("fall.recover", "fallRecover");
		take("down.recover", "downRecover");
		take("pausetime", "pausetime");
		take("p2stateno", "p2stateno");
		take("p1stateno", "p1stateno");
		if (p.guardflag != null || !partial)
			out.guardflag = this.str(p.guardflag).toUpperCase();
		if (p.attr != null) out.attr = this.str(p.attr).toUpperCase();
		return out;
	}
	hitbox() {
		const { frame } = this.elemAt();
		return frame?.hit ? frame : null;
	}
}

/* The opponent, as far as triggers can ask: standing idle (or --p2 C/A),
   in hitstun once a hit has landed in the hit scenario. Anything else about
   them stays unknown. */
const P2_STATE = (option("p2") || "S").toUpperCase();
function opponent(sim) {
	if (sim.p2) return sim.p2;
	const p2 = Object.create(Char.prototype);
	Object.assign(p2, { sim, parent: null, maps: {}, targets: 0 });
	p2.root = p2;
	const hit = () => sim.scenario === "hit" && sim.hits.length > 0;
	p2.trigger = function ({ name, args: a, axis }) {
		switch (name) {
			case "const": {
				// Unknown opponent: measured as a mirror match.
				const k = a?.[0]?.v?.toLowerCase();
				if (k in constants)
					return this.assume(
						"opponent's constants = this character's (mirror match)",
						constants[k],
					);
				break;
			}
			case "statetype":
				return P2_STATE;
			case "movetype":
				return hit() ? "H" : "I";
			case "stateno":
				return hit() ? 5000 : 0;
			case "ctrl":
				return num(!hit());
			case "life":
			case "lifemax":
				return 1000;
			case "powermax":
				return 3000;
			case "facing":
				return -1;
			case "vel":
				return 0;
			case "pos":
				return axis === "y" ? 0 : (DISTANCE ?? 0);
			case "alive":
				return 1;
			case "hitshakeover": {
				// Still shaking for the hit's pausetime after it lands.
				const last = sim.hits.at(-1);
				return num(!hit() || sim.g - last.tick > (Number(last.pausetime) || 0));
			}
			case "time":
				return hit() ? sim.g - sim.hits.at(-1).tick : sim.g;
			case "dizzy":
			case "hitfall":
			case "incustomstate":
			case "receiveddamage":
			case "movereversed":
				return 0;
		}
		throw new Unknown(`p2, ${name}`);
	};
	sim.p2 = p2;
	return p2;
}

// Controllers whose triggers don't matter to frame data.
const IGNORED = new Set([
	"playsnd",
	"stopsnd",
	"sndpan",
	"explod",
	"modifyexplod",
	"removeexplod",
	"palfx",
	"bgpalfx",
	"allpalfx",
	"envshake",
	"envcolor",
	"trans",
	"sprpriority",
	"angledraw",
	"angleset",
	"angleadd",
	"anglemul",
	"assertspecial",
	"screenbound",
	"playerpush",
	"width",
	"attackdist",
	"afterimage",
	"afterimagetime",
	"makedust",
	"gamemakeanim",
	"displaytoclipboard",
	"appendtoclipboard",
	"clearclipboard",
	"posfreeze",
	"dizzyset",
	"targetdizzypointsadd",
	"targetpoweradd",
	"poweradd",
	"hitfalldamage",
	"hitvelset",
	"fallenvshake",
	"offset",
	"remappal",
	"victoryquote",
]);

// ------------------------------------------------------------------- running
function run(scenario) {
	const sim = new Sim(scenario);
	const p1 = new Char(sim, {
		stateNo: Number(startArg),
		y: -Number(option("height") ?? 0),
	});
	if (option("vel"))
		[p1.vel.x, p1.vel.y] = option("vel").split(",").map(Number);
	p1.ctrl = 0;
	sim.chars.push(p1);
	const ticks = [];
	let end = null;
	let rootDone = null;
	for (sim.g = 0; sim.g < MAX; sim.g++) {
		const g = sim.g;
		const paused = sim.pause && g >= sim.pause.start && g <= sim.pause.end;
		const moving = (c) => {
			if (!paused) return true;
			const into = g - sim.pause.start;
			return c.parent ? into < c.superMove : into < sim.pause.movetime;
		};
		const active = sim.chars.filter((c) => c.alive && moving(c));
		for (const c of [...active]) {
			if (rootDone != null && c === p1) continue;
			if (c.pendingState != null) {
				const s = c.pendingState;
				c.pendingState = null;
				c.changeState(s);
			}
			c.process();
		}
		// Hit detection, on the frames as they stand this tick.
		const record = {
			g,
			state: p1.stateNo,
			time: p1.time,
			type: p1.statetype,
			ctrl: p1.ctrl,
			paused,
			frozen: !moving(p1),
			x: p1.pos.x,
			y: p1.pos.y,
			own: false,
			helper: false,
		};
		for (const c of active) {
			if (!c.alive) continue;
			const box = c.hitbox();
			if (box && c.hitdef) {
				if (c === p1) record.own = true;
				else record.helper = true;
				const reach = c.pos.x + (box.reach ?? 0) * c.facing;
				const target = (DISTANCE ?? 0) + (constants["size.ground.front"] ?? 16);
				const inRange = DISTANCE == null ? true : reach >= target;
				if (scenario !== "whiff" && inRange) {
					// A throw (or any unblockable HitDef) can't be guarded.
					const hit = scenario === "hit" || !c.hitdef.guardflag;
					sim.hits.push({ tick: g, who: c.label(), ...c.hitdef });
					c.contact = { tick: g, hit, guarded: !hit };
					if (hit) {
						c.hitCount++;
						c.targets = 1;
						c.root.targets = c.root.targets || (c === c.root ? 1 : 0);
					}
					if (hit && c.hitdef.p1stateno != null)
						c.pendingState = c.hitdef.p1stateno;
					c.hitdef = null;
				}
			}
			if (c === p1) {
				record.inv = g <= p1.invulnUntil ? p1.invulnAttr : "";
				record.counter =
					!!(p1.reversal && box) || !!(p1.override && g <= p1.override.until);
			}
		}
		if (rootDone == null) ticks.push(record);
		// Movement, gravity, landing, animation.
		for (const c of active) {
			if (!c.alive || (rootDone != null && c === p1)) continue;
			c.pos.x += c.vel.x * c.facing;
			c.pos.y += c.vel.y;
			if (c.physics === "A") {
				c.vel.y += constants["movement.yaccel"] ?? 0.44;
				if (c.pos.y >= 0 && c.vel.y > 0 && c.statetype === "A") {
					c.pos.y = 0;
					c.pendingState = 52;
				}
			} else if (c.physics === "S" || c.physics === "C") {
				const fr =
					constants[
						c.physics === "S"
							? "movement.stand.friction"
							: "movement.crouch.friction"
					] ?? 0.85;
				c.vel.x *= fr;
				if (
					Math.abs(c.vel.x) <
					(constants["movement.stand.friction.threshold"] ?? 0)
				)
					c.vel.x = 0;
			}
			c.elapsed++;
			c.time++;
		}
		if (rootDone == null && p1.ctrl && g > 0) {
			rootDone = g;
			sim.rootDone = g;
			end = g + 1;
		}
		if (!p1.alive && rootDone == null) {
			rootDone = g;
			end = null;
		}
		const helpersLive = sim.chars.some((c) => c.parent && c.alive);
		if (rootDone != null && (!helpersLive || g - rootDone > 240)) break;
	}
	return { sim, p1, ticks, total: end };
}

// ------------------------------------------------------------------- report
function phases(ticks) {
	const own = ticks.map((t) => t.own);
	const firstActive = own.indexOf(true);
	const lastActive = own.lastIndexOf(true);
	// Recovery is "land" only when the move was in the air once it attacked;
	// a hop before the attack (Axle Spin Knuckle) leaves ordinary recovery.
	let airborne = false;
	return ticks.map((t, i) => {
		if (t.type === "A" && firstActive !== -1 && i >= firstActive)
			airborne = true;
		if (t.paused) return "flash";
		if (t.own) return "active";
		if (firstActive === -1 || i < firstActive) return "startup";
		// Between active windows: recovery (airborne if she's in the air).
		if (t.type === "A") return "air";
		if (i < lastActive) return "recovery";
		return airborne ? "land" : "recovery";
	});
}
function rle(list) {
	const out = [];
	for (const p of list) {
		const last = out.at(-1);
		if (last && last[0] === p) last[1]++;
		else out.push([p, 1]);
	}
	return out;
}
function ranges(ticks, test) {
	const out = [];
	ticks.forEach((t, i) => {
		if (!test(t)) return;
		const last = out.at(-1);
		if (last && last[1] === i) last[1] = i + 1;
		else out.push([i, i + 1]);
	});
	return out
		.map(([a, b]) => (b - a === 1 ? `${a + 1}` : `${a + 1}-${b}`))
		.join(",");
}

const kdType = (h) => {
	if (!(h.fall > 0)) return null;
	const air = h.fallRecover ?? 1;
	const down = h.downRecover ?? 1;
	if (typeof air === "string" || typeof down === "string")
		return `KD (fall.recover ${air}, down.recover ${down})`;
	return !air && !down ? "HKD" : !air ? "KD (medium)" : "KD";
};
const sign = (v) =>
	typeof v === "number" ? (v > 0 ? `+${v}` : String(v)) : (v ?? "?");
const guardName = (flag) => {
	const f = flag || "";
	if (!f) return "unblockable";
	if (f.includes("M") || (f.includes("H") && f.includes("L"))) return "mid";
	if (f.includes("H")) return "high";
	if (f.includes("L")) return "low";
	return f;
};

function summarise({ sim, ticks, total }) {
	const ph = phases(ticks);
	const segs = rle(ph);
	const firstActive = ph.indexOf("active");
	if (firstActive !== -1) {
		// startup counts the first active frame (the site's convention)
		const k = segs.findIndex((s) => s[0] === "active");
		if (k > 0 && segs[k - 1][0] === "startup") segs[k - 1][1]++;
	}
	const bar = segs.map(([p, n]) => `${p}=${n}`).join(" ");
	const inv = ranges(
		ticks,
		(t) =>
			/^SCA/.test(t.inv || "") ||
			(t.inv &&
				/S/.test(t.inv) &&
				/C/.test(t.inv) &&
				/A/.test(t.inv) &&
				!t.inv.startsWith("except")),
	);
	const partial = [
		...new Set(
			ticks
				.filter(
					(t) =>
						t.inv &&
						!(
							/S/.test(t.inv) &&
							/C/.test(t.inv) &&
							/A/.test(t.inv) &&
							!t.inv.startsWith("except")
						),
				)
				.map((t) => t.inv),
		),
	];
	const counter = ranges(ticks, (t) => t.counter);
	const helperActive = ranges(ticks, (t) => t.helper);
	const path = [];
	for (const t of ticks) {
		const last = path.at(-1);
		if (last && last.state === t.state) last.to = t.g;
		else path.push({ state: t.state, from: t.g, to: t.g });
	}
	const hits = sim.hits.map((h) => {
		const out = { ...h, frame: h.tick + 1 };
		if (h.throwDamage != null) return out;
		out.guard = guardName(h.guardflag);
		out.kd = kdType(h);
		if (total != null && typeof h.hitstun === "number")
			out.onHit = h.hitstun - (total - h.tick);
		if (total != null && typeof h.blockstun === "number")
			out.onBlock = h.blockstun - (total - h.tick);
		return out;
	});
	return {
		scenario: sim.scenario,
		total,
		bar,
		frameData: [bar, inv && `inv=${inv}`, counter && `counter=${counter}`]
			.filter(Boolean)
			.join(" ; "),
		firstActive: firstActive === -1 ? null : firstActive + 1,
		helperActive,
		partialInvuln: partial,
		airborne: ranges(ticks, (t) => t.type === "A"),
		flash: sim.pause
			? {
					start: sim.pause.start + 1,
					length: sim.pause.end - sim.pause.start + 1,
					movetime: sim.pause.movetime,
				}
			: null,
		path,
		hits,
		ticks,
		helpers: sim.chars
			.filter((c) => c.parent)
			.map((c) => ({
				id: c.helperId,
				spawned: c.spawned + 1,
				states: c.log.map((l) => l.state),
			})),
		unknown: [...sim.unknown.entries()].map(
			([k, v]) => `${k}  (x${v.count}, first at frame ${v.tick + 1})`,
		),
		assumed: [...sim.assumed],
		unsetMaps: [...sim.unsetMaps],
		globalUnknown: sim.globalUnknown.size,
		events: [...new Set(sim.events)],
	};
}

const results = SCENARIOS.map((s) => summarise(run(s)));

if (flag("json")) {
	console.log(
		JSON.stringify(
			{
				state: Number(startArg),
				set: SETS,
				pin: PINS,
				distance: DISTANCE,
				results: results.map((r) =>
					flag("ticks") ? r : { ...r, ticks: undefined },
				),
			},
			null,
			2,
		),
	);
} else {
	const st = byId.get(Number(startArg));
	console.log(
		`${startArg}  ${st?.name ?? ""}  set ${JSON.stringify(SETS)}${Object.keys(PINS).length ? ` pin ${JSON.stringify(PINS)}` : ""}${DISTANCE != null ? `  distance ${DISTANCE}` : "  point-blank"}`,
	);
	for (const r of results) {
		console.log(
			`\n[${r.scenario}] total ${r.total ?? "? (never regained control)"}`,
		);
		console.log(
			`  path: ${r.path.map((p) => `${p.state} (f${p.from + 1}-${p.to + 1})`).join(" -> ")}`,
		);
		console.log(`  frame data: ${r.frameData}`);
		if (r.airborne) console.log(`  airborne frames: ${r.airborne}`);
		if (r.flash)
			console.log(
				`  super pause: frames ${r.flash.start}-${r.flash.start + r.flash.length - 1} (movetime ${r.flash.movetime})`,
			);
		if (r.helperActive)
			console.log(
				`  helper hitbox active (frames, while P1 still recovering): ${r.helperActive}`,
			);
		if (r.partialInvuln.length)
			console.log(`  partial invulnerability: ${r.partialInvuln.join("; ")}`);
		for (const h of r.helpers)
			console.log(
				`  helper id ${h.id} spawned f${h.spawned}: states ${[...new Set(h.states)].join(" -> ")}`,
			);
		for (const h of r.hits) {
			if (h.throwDamage != null) {
				console.log(
					`  throw damage @f${h.frame} (${h.who}, state ${h.state}): ${h.throwDamage}`,
				);
				continue;
			}
			console.log(
				`  contact @f${h.frame} (${h.who}, state ${h.state}, line ${h.line}): dmg ${h.damage ?? "-"}, ${h.guard}, hitstun ${h.hitstun}, blockstun ${h.blockstun}${h.kd ? `, ${h.kd}` : ""}` +
					(r.scenario === "block"
						? `  on block ${sign(h.onBlock)}`
						: r.scenario === "hit"
							? `  on hit ${h.kd ? h.kd.split(" ")[0] : sign(h.onHit)}`
							: ""),
			);
		}
		for (const e of r.events) console.log(`  ! ${e}`);
		for (const u of r.unknown) console.log(`  ? ${u}`);
		if (r.assumed.length) console.log(`  assumed: ${r.assumed.join("; ")}`);
		if (r.globalUnknown)
			console.log(
				`  (${r.globalUnknown} controller(s) in states -2/-3 skipped: triggers about the opponent)`,
			);
		if (r.unsetMaps.length)
			console.log(
				`  maps read but never set (0; --set them if that's wrong): ${r.unsetMaps.join(", ")}`,
			);
		if (flag("ticks")) {
			for (const t of r.ticks)
				console.log(
					`    f${t.g + 1} st ${t.state} t${t.time} ${t.type} ctrl ${t.ctrl} y ${t.y.toFixed(2)} x ${t.x.toFixed(1)}${t.own ? " HIT" : ""}${t.helper ? " helperHIT" : ""}${t.inv ? ` inv(${t.inv})` : ""}${t.paused ? " pause" : ""}${t.frozen ? " frozen" : ""}`,
				);
		}
	}
}
