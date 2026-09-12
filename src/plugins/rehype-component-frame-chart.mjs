/// <reference types="mdast" />
import { h } from "hastscript";
import { IconImageComponent } from "./rehype-component-icon.mjs";

/**
 * Frame-data chart: a stacked horizontal timeline, one bar per move version.
 *
 * :::framechart{max=120 caption="Tornado Kick"}
 * Light  | startup=3 active=18 air=14 land=5 | inv=15 | mark=Landing@air
 * Medium | startup=3 active=25 air=21 land=5 | inv=4-18
 * :::
 *
 * Field 1 is the row label, field 2 the main track, and any further field is
 * either another (thin) track or a field of `mark=` annotations. A phase is a
 * count that follows on from the last one, or a `6-20` range that pins itself
 * to those frames - and takes a comma-separated list of either, for a move
 * that hits more than once.
 */

/* Phase styling.
 *
 * The phases that carry colour take the site's hue, as three steps of one
 * ordinal ramp - startup darkest, active lightest, recovery between. Since
 * they can no longer differ by hue, lightness is what separates them, which
 * holds for colourblind readers at any hue the picker reaches. Phases where
 * nothing is happening carry no hue at all (which is also what the printed
 * charts do), and a second track takes a step of the same ramp hatched over in
 * black, so it is never told apart from the main track by colour alone. The
 * steps themselves live in `variables.styl`.
 */
const KINDS = {
	startup: { label: "Startup", fill: "startup" },
	active: { label: "Active", fill: "active" },
	recovery: { label: "Recovery", fill: "recovery" },
	air: { label: "Airborne", fill: "hollow" },
	land: { label: "Landing recovery", fill: "neutral" },
	inv: { label: "Invulnerable", fill: "inv" },
	armor: { label: "Armor", fill: "armor" },
	counter: { label: "Counter state", fill: "counter" },
	gap: { label: null, fill: "none" },
};

const ALIASES = {
	su: "startup",
	start: "startup",
	act: "active",
	hit: "active",
	rec: "recovery",
	recover: "recovery",
	airborne: "air",
	juggle: "air",
	landing: "land",
	invuln: "inv",
	invincible: "inv",
	invincibility: "inv",
	cs: "counter",
	counterstate: "counter",
	space: "gap",
};

const resolveKind = (raw) => {
	const key = String(raw).toLowerCase();
	return ALIASES[key] || key;
};

const titleCase = (s) =>
	s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_]/g, " ");

/** Straight and curly quotes both - Astro's markdown runs smartypants. */
const unquote = (s) =>
	s
		.trim()
		.replace(/^["'“”‘’]|["'“”‘’]$/g, "")
		.trim();

const BLOCK_TAGS = /^(p|div|pre|li|ul|ol|h[1-6]|blockquote|section)$/;
const PASSTHROUGH_TAGS =
	/^(p|div|pre|code|li|ul|ol|h[1-6]|blockquote|section|span|em|strong|a|br|del|sup|sub)$/;

/* Directives that keep working inside a chart. rehype-components walks from
   the top down and skips whatever a component returns, so an `:icon{}` in a
   row label never gets its own turn - it has to be rendered here. */
const INLINE_COMPONENTS = { icon: IconImageComponent };

/** Flatten the parsed children into text runs and inline nodes.
 *
 * Text is what the row syntax is parsed from; the nodes are what lets a label
 * carry a glyph. Anything else that isn't plain markup got there by
 * remark-directive biting into the body - `:word` is a text directive - so put
 * the colon and the name back rather than letting it disappear. */
function collectItems(nodes, out = []) {
	for (const node of nodes || []) {
		if (node.type === "text") {
			out.push({ text: node.value });
		} else if (node.type === "element") {
			const block = BLOCK_TAGS.test(node.tagName);
			if (block && out.length) out.push({ text: "\n" });
			if (node.tagName === "br") out.push({ text: "\n" });
			if (INLINE_COMPONENTS[node.tagName]) {
				out.push({ node });
				continue;
			}
			if (!PASSTHROUGH_TAGS.test(node.tagName)) {
				out.push({ text: `:${node.tagName}` });
			}
			collectItems(node.children, out);
			if (block) out.push({ text: "\n" });
		}
	}
	return out;
}

const itemsText = (items) =>
	items
		.map((item) => (item.node ? `:${item.node.tagName}` : item.text))
		.join("");

/** Break the items into one list per source line. */
function splitLines(items) {
	const lines = [[]];
	const last = () => lines[lines.length - 1];
	for (const item of items) {
		if (item.node) {
			last().push(item);
			continue;
		}
		item.text.split("\n").forEach((part, index) => {
			if (index > 0) lines.push([]);
			if (part) last().push({ text: part });
		});
	}
	return lines;
}

/** Split a line at its first `|`, keeping the label's nodes intact. The `|`
 *  itself stays with the remainder so the field numbering doesn't shift. */
function splitLabel(items) {
	const label = [];
	const rest = [];
	let found = false;
	for (const item of items) {
		if (found || item.node) {
			(found ? rest : label).push(item);
			continue;
		}
		const at = item.text.indexOf("|");
		if (at === -1) {
			label.push(item);
			continue;
		}
		found = true;
		if (at > 0) label.push({ text: item.text.slice(0, at) });
		rest.push({ text: item.text.slice(at) });
	}
	return { label, rest };
}

/** Render label items as hast children, trimming the outer whitespace. */
function buildInline(items, { unquoteText = false } = {}) {
	const trimmed = items
		.map((item, index) => {
			if (item.node) return item;
			let text = item.text;
			if (index === 0) text = text.replace(/^\s+/, "");
			if (index === items.length - 1) text = text.replace(/\s+$/, "");
			return { text };
		})
		.filter((item) => item.node || item.text !== "");

	/* A plain text label may be quoted; one carrying glyphs is left alone. */
	if (unquoteText && trimmed.length === 1 && trimmed[0].text !== undefined) {
		return [{ type: "text", value: unquote(trimmed[0].text) }];
	}

	return trimmed.map((item) =>
		item.node
			? INLINE_COMPONENTS[item.node.tagName](
					item.node.properties || {},
					item.node.children,
				)
			: { type: "text", value: item.text },
	);
}

/* A number, or a `6-20` range. */
const SPAN = /\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?/;
/* `active=4-15,28-57` - a phase followed by one or more spans. A comma can
   only continue the list when a number follows it, so `inv=1-9,armor=10-20`
   still reads as two phases. */
const SEGMENT_PATTERN = `([A-Za-z][\\w-]*)\\s*[=:]\\s*(${SPAN.source}(?:\\s*,\\s*${SPAN.source})*)`;

/** `startup=3 active=4-15,28-57` -> [{kind, value, start}], order preserved.
 *
 * A plain count carries on from the segment before it; a range pins itself to
 * those frames. Listing several spans against one phase is how a move that
 * hits, recovers and hits again gets written. */
function parseSegments(field, warnings) {
	const segments = [];

	for (const token of field.matchAll(new RegExp(SEGMENT_PATTERN, "g"))) {
		const kind = resolveKind(token[1]);
		for (const part of token[2].split(",")) {
			const span = part.trim().match(new RegExp(`^${SPAN.source}$`));
			if (!span) continue;
			const [from, to] = part.split(/[-–]/).map((n) => Number(n.trim()));
			/* Frames are inclusive and 1-based: 6-20 is 15 frames starting at 6. */
			const value = to === undefined ? from : to - from + 1;
			const start = to === undefined ? undefined : from - 1;
			if (!Number.isFinite(value) || value <= 0) continue;
			if (start !== undefined && start < 0) continue;
			segments.push({ kind, value, start });
		}
	}

	/* Anything the tokeniser couldn't place would otherwise vanish from the
	   chart without a word, so say so at build time. */
	const leftover = field
		.replace(new RegExp(SEGMENT_PATTERN, "g"), "")
		.replace(/[\s,]+/g, " ")
		.trim();
	if (leftover && warnings) warnings.push(leftover);

	return segments;
}

/** Resolve every segment to an absolute span, so the three things that need
 *  positions - the bars, the scale, and the marks - agree on one answer. */
function layout(segments) {
	let cursor = 0;
	return segments.map((segment) => {
		const start = segment.start ?? cursor;
		cursor = start + segment.value;
		return { ...segment, start, end: cursor };
	});
}

const trackEnd = (segments) =>
	layout(segments).reduce((end, segment) => Math.max(end, segment.end), 0);

function parseRow(line, warnings) {
	const fields = line.split("|").map((f) => f.trim());
	const label = unquote(fields[0] || "");
	const main = parseSegments(fields[1] || "", warnings);
	const tracks = [];
	const marks = [];

	for (const field of fields.slice(2)) {
		if (!field) continue;
		if (/^mark\s*[=:]/i.test(field)) {
			for (const token of field.split(/\s*,\s*/)) {
				const body = token.trim().replace(/^mark\s*[=:]\s*/i, "");
				/* `Landing@air` is the documented form; `air:Landing` still works
				   for anything written before the separator moved to `@`. */
				const at = body.includes("@")
					? {
							text: body.slice(0, body.lastIndexOf("@")),
							at: body.slice(body.lastIndexOf("@") + 1),
						}
					: body.includes(":")
						? {
								at: body.slice(0, body.indexOf(":")),
								text: body.slice(body.indexOf(":") + 1),
							}
						: null;
				if (!at || !at.at.trim()) continue;
				marks.push({ at: at.at.trim(), text: unquote(at.text) });
			}
			continue;
		}
		const segments = parseSegments(field, warnings);
		if (segments.length) tracks.push(segments);
	}

	return { label, main, tracks, marks };
}

/** Absolute frame for a mark: a number, or the name of a phase it follows. */
function resolveMarkFrame(at, main) {
	if (/^-?\d+(\.\d+)?$/.test(at)) return Number(at);
	const kind = resolveKind(at);
	let found = null;
	for (const segment of layout(main)) {
		if (segment.kind === kind) found = segment.end;
	}
	return found;
}

/** A phase keeps its own name in the legend; `map` only lends it a fill. */
const kindStyle = (kind, map) => {
	const known = KINDS[kind];
	const borrowed = map?.[kind] ? KINDS[map[kind]] : null;
	if (known && !borrowed) return known;
	return {
		label: known ? known.label : titleCase(kind),
		fill: borrowed ? borrowed.fill : known ? known.fill : "neutral",
	};
};

/** Wide enough for the number to sit inside the segment without clipping. */
function fitsInside(value, max) {
	const pct = (value / max) * 100;
	const digits = String(value).length;
	return pct >= digits * 2.6 + 1.4;
}

function buildSegments(segments, max, opts) {
	const { showValues, thin, map } = opts;
	const nodes = [];
	const outside = [];

	/* Gaps hold their place but aren't drawn, so a neighbour across one counts
	   as a free end, not a touching one. */
	const drawn = layout(segments)
		.map((segment) => ({
			...segment,
			name: segment.kind,
			kind: kindStyle(segment.kind, map),
		}))
		.filter((segment) => segment.kind.fill !== "none");

	/* Which edges are free decides the rounding and the separator, and with
	   ranges in play that is adjacency rather than position in the line. */
	const meets = (frame) => drawn.some((other) => other.start === frame);
	const follows = (frame) => drawn.some((other) => other.end === frame);

	drawn.forEach((segment) => {
		const { start, end, kind } = segment;
		const inside = !thin && showValues && fitsInside(segment.value, max);
		const style = `left:${(start / max) * 100}%;width:${(segment.value / max) * 100}%`;
		const classes = [
			"fc-seg",
			`fc-fill-${kind.fill}`,
			meets(end) ? "" : "fc-seg-end",
			start > 0 && !follows(start) ? "fc-seg-free-start" : "",
		]
			.filter(Boolean)
			.join(" ");

		nodes.push(
			h(
				"div",
				{
					class: classes,
					style,
					title: `${kind.label || titleCase(segment.name)}: ${segment.value} (frames ${start + 1}-${end})`,
				},
				inside
					? [h("span", { class: "fc-seg-value" }, String(segment.value))]
					: [],
			),
		);

		if (inside || !showValues) return;

		/* A thin track's value rides just past the end of its bar, costing no
		   height at all. Only a window with something butted up against that
		   end has to fall back to a label lane. */
		if (thin && !meets(end)) {
			/* Normally just past the bar's end. A window running to the right
			   edge has no room there, so it reads back from the bar's start
			   instead - and only sits on the fill when there is no room
			   either side. */
			const crowded = end / max > 0.88;
			const roomBefore = start / max > 0.06;
			const place = crowded && roomBefore ? "before" : crowded ? "inside" : "";
			nodes.push(
				h(
					"span",
					{
						class: `fc-sub-value${place ? ` fc-sub-value-${place}` : ""}`,
						style: `left:${((place === "before" ? start : end) / max) * 100}%`,
					},
					String(segment.value),
				),
			);
			return;
		}

		outside.push(
			h(
				"div",
				{
					class: `fc-outside${thin ? " fc-outside-sub" : ""}`,
					style: `left:${((start + segment.value / 2) / max) * 100}%`,
				},
				[h("span", { class: "fc-outside-value" }, String(segment.value))],
			),
		);
	});

	return { nodes, outside };
}

export function FrameChartComponent(properties, children) {
	const props = properties || {};
	const get = (...names) => {
		for (const name of names) {
			if (props[name] != null && props[name] !== "") return props[name];
		}
		return undefined;
	};

	const captionAttr = get("caption", "title");
	let caption = captionAttr
		? [{ type: "text", value: String(captionAttr) }]
		: null;
	let body = children;

	if (props["has-directive-label"] && Array.isArray(body) && body.length) {
		const label = buildInline(collectItems([body[0]]));
		if (label.length && !caption) caption = label;
		body = body.slice(1);
	}

	const map = {};
	const mapAttr = get("map");
	if (mapAttr) {
		for (const pair of String(mapAttr).split(/\s*,\s*/)) {
			const [from, to] = pair.split(/\s*[=:]\s*/);
			if (from && to) map[resolveKind(from)] = resolveKind(to);
		}
	}

	const warnings = [];
	const rows = splitLines(collectItems(body))
		.filter((line) => {
			const text = itemsText(line).trim();
			return text && !text.startsWith("#");
		})
		.map((line) => {
			/* The label keeps its nodes, so a glyph in it survives; everything
			   after the first `|` is parsed from text as before. */
			const { label, rest } = splitLabel(line);
			return {
				...parseRow(itemsText(rest), warnings),
				label: buildInline(label, { unquoteText: true }),
			};
		})
		.filter((row) => row.main.length);

	if (warnings.length) {
		console.warn(
			`[framechart] ignored, not a "phase=frames" token: ${warnings.join(" | ")}`,
		);
	}

	if (!rows.length) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid framechart directive. (Must be ":::framechart{}" wrapping at least one "Label | startup=3 active=18" line.)',
		);
	}

	const longest = Math.max(
		...rows.map((row) =>
			Math.max(trackEnd(row.main), ...row.tracks.map(trackEnd)),
		),
	);
	/* Ticks are spaced off the scale actually drawn, so a `max` set wider than
	   the data doesn't leave the axis crowded with the data's own step. */
	const given = Number(get("max"));
	const step =
		Number(get("step")) > 0
			? Number(get("step"))
			: niceStep(given > 0 ? given : longest);
	const max = given > 0 ? given : Math.ceil(longest / step) * step;
	const showValues = String(get("labels") ?? "auto") !== "off";
	const unit = get("unit") ?? "frames";

	const ticks = [];
	for (let frame = 0; frame <= max + 1e-9; frame += step) {
		ticks.push(Math.round(frame * 1000) / 1000);
	}

	/* Drawn per row rather than once behind the whole grid: every plot cell is
	   the same column, so the lines still read as continuous, and they cannot
	   drift out of step with the bars. */
	const gridlines = () =>
		h(
			"div",
			{ class: "fc-gridlines" },
			ticks.map((frame) =>
				h("div", {
					class: `fc-gridline${frame === 0 ? " fc-gridline-zero" : ""}`,
					style: `left:${(frame / max) * 100}%`,
				}),
			),
		);

	const grid = [];

	/* Lanes carry their own height as a CSS expression. Summing those is what
	   lets the label centre on the bars and the mark caret reach back up to
	   the main bar, whatever lanes a particular row happens to need. */
	const sum = (parts) => (parts.length ? `calc(${parts.join(" + ")})` : "0px");

	for (const row of rows) {
		const main = buildSegments(row.main, max, { showValues, thin: false, map });
		const lanes = [{ node: gridlines() }];

		if (main.outside.length) {
			lanes.push({
				node: h("div", { class: "fc-lane fc-lane-outside" }, main.outside),
				h: "var(--fc-lane-h)",
			});
		}

		const barIndex = lanes.length;
		lanes.push({
			node: h("div", { class: "fc-track fc-track-main" }, main.nodes),
			h: "var(--fc-bar-h)",
			bar: true,
		});

		for (const track of row.tracks) {
			const sub = buildSegments(track, max, { showValues, thin: true, map });
			lanes.push({
				node: h("div", { class: "fc-track fc-track-sub" }, sub.nodes),
				h: "var(--fc-sub-gap) + var(--fc-sub-h)",
				bar: true,
			});
			if (sub.outside.length) {
				lanes.push({
					node: h("div", { class: "fc-lane fc-lane-sub" }, sub.outside),
					h: "var(--fc-lane-h)",
				});
			}
		}

		/* Everything above the main bar the label has to clear, everything
		   from the main bar down to the last bar it centres on, and the band
		   between the main bar and the mark lane the caret has to climb. */
		const lift = sum(
			lanes
				.slice(0, barIndex)
				.map((lane) => lane.h)
				.filter(Boolean),
		);
		const lastBar = lanes.map((lane) => !!lane.bar).lastIndexOf(true);
		const group = sum(
			lanes
				.slice(barIndex, lastBar + 1)
				.map((lane) => lane.h)
				.filter(Boolean),
		);
		const rise = sum(
			lanes
				.slice(barIndex + 1)
				.map((lane) => lane.h)
				.filter(Boolean),
		);

		const marks = row.marks
			.map((mark) => ({ ...mark, frame: resolveMarkFrame(mark.at, row.main) }))
			.filter((mark) => Number.isFinite(mark.frame));

		if (marks.length) {
			lanes.push({
				node: h(
					"div",
					{ class: "fc-lane fc-lane-marks", style: `--fc-mark-rise:${rise}` },
					marks.map((mark) =>
						h(
							"div",
							{ class: "fc-mark", style: `left:${(mark.frame / max) * 100}%` },
							[
								h("span", { class: "fc-mark-caret" }),
								h("span", { class: "fc-mark-leader" }),
								h("span", { class: "fc-mark-text" }, mark.text),
							],
						),
					),
				),
			});
		}

		/* The label centres on the run of bars, not on the lanes of numbers
		   and annotations stacked around them. */
		grid.push(
			h(
				"div",
				{
					class: "fc-row-label",
					style: `--fc-lift:${lift};--fc-group:${group}`,
				},
				/* Wrapped so the label is one flex item: a glyph and its text
				   then flow as inline content and keep the space between them,
				   which separate flex items would drop. */
				[h("span", { class: "fc-row-label-text" }, row.label)],
			),
		);
		grid.push(
			h(
				"div",
				{ class: "fc-row-plot" },
				lanes.map((lane) => lane.node),
			),
		);
	}

	/* The unit rides in the label column, level with the ticks, so it never
	   has to fight the last tick for the right-hand end of the axis. */
	grid.push(h("div", { class: "fc-axis-unit" }, unit || ""));
	grid.push(
		h(
			"div",
			{ class: "fc-axis" },
			ticks.map((frame, index) => {
				const edge =
					index === 0
						? " fc-tick-first"
						: index === ticks.length - 1
							? " fc-tick-last"
							: "";
				return h(
					"span",
					{ class: `fc-tick${edge}`, style: `left:${(frame / max) * 100}%` },
					String(frame),
				);
			}),
		),
	);

	const used = [];
	for (const row of rows) {
		for (const segment of [...row.main, ...row.tracks.flat()]) {
			const kind = kindStyle(segment.kind, map);
			if (kind.fill === "none" || !kind.label) continue;
			if (!used.some((entry) => entry.key === segment.kind)) {
				used.push({ key: segment.kind, label: kind.label, fill: kind.fill });
			}
		}
	}

	/* Legend runs in phase order, not in the order the rows happened to
	   introduce them, so a move that skips a phase doesn't reshuffle it. */
	const phaseOrder = Object.keys(KINDS);
	const rank = (entry) => {
		const index = phaseOrder.indexOf(entry.key);
		return index === -1 ? phaseOrder.length : index;
	};
	used.sort((a, b) => rank(a) - rank(b));

	const parts = [];
	if (caption?.length) {
		parts.push(h("figcaption", { class: "fc-caption" }, caption));
	}
	parts.push(h("div", { class: "fc-grid" }, grid));

	if (used.length > 1 && String(get("legend") ?? "true") !== "false") {
		parts.push(
			h(
				"div",
				{ class: "fc-legend" },
				used.map((entry) =>
					h("span", { class: "fc-legend-item" }, [
						h("span", { class: `fc-swatch fc-fill-${entry.fill}` }),
						entry.label,
					]),
				),
			),
		);
	}

	return h("figure", { class: "frame-chart not-prose" }, parts);
}

/** Ticks on clean numbers: 5, 10, 20, 25, 50, 100... */
function niceStep(total) {
	const target = total / 6;
	for (const candidate of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500]) {
		if (candidate >= target) return candidate;
	}
	return 1000;
}
