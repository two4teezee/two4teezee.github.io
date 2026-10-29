/// <reference types="mdast" />
import { h } from "hastscript";
import {
	axisScale,
	buildAxis,
	buildGridlines,
	buildInline,
	buildLegend,
	buildRowLanes,
	collectItems,
	INLINE_COMPONENTS,
	itemsText,
	parseMap,
	parseRow,
	rowEnd,
} from "./rehype-component-frame-chart.mjs";

/**
 * Frame-data table: an ordinary markdown table whose last column is drawn as a
 * frame-data bar, one per row.
 *
 * :::frametable{caption="Normals"}
 * | Move | Damage | Stun | Frame Data |
 * |---|--:|--:|---|
 * | :icon{name="^LP"} close | 6 | 2 | startup=3 active=9 recovery=10 |
 * | :icon{name="^MP"} close | 13 | 4 | startup=4 active=5 recovery=24 ; inv=1-3 |
 * :::
 *
 * Every column but the last is passed through as written, glyphs and all. The
 * last takes the same `phase=frames` tokens as a framechart's bar; `;` starts
 * another field, the way `|` does in a framechart line, since a `|` there
 * would end the cell. There is no axis: every bar is drawn against the longest
 * move in the table, so the longest one fills its cell.
 *
 * Anything after the table - set off by a blank line, or markdown reads it as
 * another row - becomes a legend row along its foot. A list is a legend, its
 * items running side by side; a paragraph is footnotes, one per line. Either
 * takes `key = text`, which sets the key apart from what it explains:
 *
 * - ○ = Cancelable
 * - × = Not cancelable
 *
 * *1 = Only on hit
 *
 * :::framechartable is the same table built for one move at several
 * strengths: the bars share a framechart's axis - ticks along the foot of the
 * bar column, gridlines through every row, `max`/`step`/`unit` - so the rows
 * can be read against absolute frame numbers rather than against each other,
 * and the bar column takes more of the width.
 *
 * :::framechartable[Cannon Drill :icon{name="_QCF"}:icon{name="^K"}]
 * | Version | Damage | Block | Frame Data |
 * |:-:|:-:|:-:|---|
 * | :icon{name="^LK"} | 70 | -12 | startup=8 active=14 land=9 |
 * | :icon{name="^HK"} | 90 | -8 | startup=10 active=18 land=9 ; inv=1-8 |
 * :::
 */

/* A cell is one line in markdown, so a literal `\n` breaks it - shorthand for
   the `<br>` that also works, and the way to stack a long header into a
   narrower column. The spaces either side of it go with it. */
const LINE_BREAK = /\s*\\n\s*/;

/* rehype-components skips whatever a component returns, so a glyph in a cell
   never gets its own turn - render it here, at any depth. */
function renderInline(nodes) {
	return (nodes || []).flatMap((node) => {
		if (node.type === "text") {
			return node.value
				.split(LINE_BREAK)
				.flatMap((part, index) => [
					...(index > 0 ? [h("br")] : []),
					...(part ? [{ type: "text", value: part }] : []),
				]);
		}
		if (node.type !== "element") return node;
		const component = INLINE_COMPONENTS[node.tagName];
		if (component) return component(node.properties || {}, node.children);
		if (node.tagName === "code") return node;
		return { ...node, children: renderInline(node.children) };
	});
}

function findTable(nodes) {
	for (const node of nodes || []) {
		if (node.type !== "element") continue;
		if (node.tagName === "table") return node;
		const found = findTable(node.children);
		if (found) return found;
	}
	return null;
}

const elements = (node, ...tags) =>
	(node?.children || []).filter(
		(child) => child.type === "element" && tags.includes(child.tagName),
	);

/* A value that leads with its sign - frame advantage, mostly - is coloured
   by it. A bare `-`, the usual "no value", is left alone. A `×` - can't, in
   a cancel column - is red whether or not anything follows it, so `×*1`
   still reads as a no. A legend key gets the same colour as the cells it
   explains. */
function signClass(nodes) {
	const text = itemsText(collectItems(nodes)).trim();
	if (/^\+./.test(text)) return "ft-plus";
	if (/^[-−]./.test(text) || /^[×✕✗]/.test(text)) return "ft-minus";
	return null;
}

/* `key = text`. Spaces either side of the `=` are what tell it from the `=`
   in a `startup=3` someone wants to quote. */
const NOTE_KEY = /\s+=\s+/;

/* Trim the outer edges of a run of inline nodes, leaving the inside alone. */
function trimInline(nodes) {
	const out = nodes.map((node) => ({ ...node }));
	const edge = (node, pattern) => {
		if (node?.type === "text") node.value = node.value.replace(pattern, "");
	};
	edge(out[0], /^\s+/);
	edge(out[out.length - 1], /\s+$/);
	return out.filter((node) => node.type !== "text" || node.value !== "");
}

/** One note's inline nodes -> its key and its text, split at the first
 *  ` = ` that sits in plain text, so a glyph or bold key works. */
function buildNote(nodes) {
	const index = nodes.findIndex(
		(node) => node.type === "text" && NOTE_KEY.test(node.value),
	);
	let key = [];
	let text = nodes;
	if (index !== -1) {
		const value = nodes[index].value;
		const match = value.match(NOTE_KEY);
		key = trimInline([
			...nodes.slice(0, index),
			{ type: "text", value: value.slice(0, match.index) },
		]);
		if (key.length) {
			text = [
				{ type: "text", value: value.slice(match.index + match[0].length) },
				...nodes.slice(index + 1),
			];
		}
	}
	text = trimInline(text);
	if (!key.length && !text.length) return null;
	return [
		...(key.length
			? [
					h(
						"span",
						{ class: ["ft-note-key", signClass(key)].filter(Boolean) },
						renderInline(key),
					),
				]
			: []),
		...(text.length
			? [h("span", { class: "ft-note-text" }, renderInline(text))]
			: []),
	];
}

/* A paragraph's lines, each its own run of inline nodes. */
function splitInlineLines(nodes) {
	const lines = [[]];
	for (const node of nodes) {
		if (node.type === "element" && node.tagName === "br") {
			lines.push([]);
		} else if (node.type === "text") {
			node.value.split("\n").forEach((part, index) => {
				if (index > 0) lines.push([]);
				if (part) lines[lines.length - 1].push({ type: "text", value: part });
			});
		} else {
			lines[lines.length - 1].push(node);
		}
	}
	return lines;
}

/** What follows the table -> the blocks of its legend row: a list becomes a
 *  wrapping row of entries, each other block a footnote per line. */
function buildNotes(nodes) {
	const blocks = [];
	for (const node of nodes) {
		if (node.type !== "element") continue;
		if (node.tagName === "ul" || node.tagName === "ol") {
			const items = elements(node, "li")
				.map((li) =>
					buildNote(
						/* A loose list wraps each item in a <p>. */
						li.children.flatMap((child) =>
							child.type === "element" && child.tagName === "p"
								? child.children
								: [child],
						),
					),
				)
				.filter(Boolean)
				.map((note) => h("span", { class: "ft-note" }, note));
			if (items.length) blocks.push(h("div", { class: "ft-legend" }, items));
			continue;
		}
		const inline = node.tagName === "p" ? node.children : [node];
		for (const line of splitInlineLines(inline)) {
			const note = buildNote(line);
			if (note) blocks.push(h("div", { class: "ft-note ft-footnote" }, note));
		}
	}
	return blocks;
}

export const FrameTableComponent = (properties, children) =>
	buildFrameTable(properties, children, { name: "frametable", axis: false });

export const FrameChartableComponent = (properties, children) =>
	buildFrameTable(properties, children, { name: "framechartable", axis: true });

/* The inset: a table with no header - markdown makes its first row one, so
   it is drawn as an ordinary row - whose column widths come from the
   directive's `inset` attribute ("75% 25%"); unlisted columns share what's
   left. */
function buildInset(table, widthsAttr) {
	const rows = ["thead", "tbody"]
		.flatMap((part) => elements(table, part))
		.flatMap((section) => elements(section, "tr"));
	const widths = String(widthsAttr ?? "")
		.split(/[\s,]+/)
		.filter(Boolean)
		.map((w) => (/^\d+(\.\d+)?$/.test(w) ? `${w}%` : w));
	const columns = Math.max(
		0,
		...rows.map((tr) => elements(tr, "th", "td").length),
	);
	return h("div", { class: "ft-inset" }, [
		h("table", [
			...(widths.length
				? [
						h(
							"colgroup",
							Array.from({ length: columns }, (_, i) =>
								h("col", widths[i] ? { style: `width: ${widths[i]}` } : {}),
							),
						),
					]
				: []),
			h(
				"tbody",
				rows.map((tr) =>
					h(
						"tr",
						elements(tr, "th", "td").map((td) =>
							h(
								"td",
								{ align: td.properties?.align },
								renderInline(td.children),
							),
						),
					),
				),
			),
		]),
	]);
}

function buildFrameTable(properties, children, { name, axis }) {
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

	/* The frame table is the last table in the body; one before it is an
	   inset - prose and clips about the move, shown above the data. */
	const tables = body.filter(
		(node) => node.type === "element" && node.tagName === "table",
	);
	const table = tables.at(-1) ?? findTable(body);
	const inset = tables.length > 1 ? buildInset(tables[0], get("inset")) : null;
	const headRow = elements(elements(table, "thead")[0], "tr")[0];
	if (!headRow) {
		return h(
			"div",
			{ class: "hidden" },
			`Invalid ${name} directive. (Must be ":::${name}{}" wrapping a markdown table whose last column is "phase=frames" data.)`,
		);
	}

	const map = parseMap(get("map"));
	const warnings = [];
	const bodyRows = elements(table, "tbody").flatMap((tbody) =>
		elements(tbody, "tr"),
	);

	/* The last cell of each row is frame data; parse them all before drawing
	   any, since the longest one sets the scale for every bar. */
	const rows = bodyRows.map((tr) => {
		const cells = elements(tr, "th", "td");
		const frames = cells[cells.length - 1];
		const text = itemsText(collectItems(frames?.children)).trim();
		return {
			cells: cells.slice(0, -1),
			frames,
			data: text ? parseRow(`|${text.replace(/;/g, "|")}`, warnings) : null,
		};
	});

	if (warnings.length) {
		console.warn(
			`[${name}] ignored, not a "phase=frames" token: ${warnings.join(" | ")}`,
		);
	}

	const drawn = rows.map((row) => row.data).filter((data) => data?.main.length);
	const longest = Math.max(1, ...drawn.map(rowEnd));
	/* With an axis the scale runs to a round number of ticks, as a
	   framechart's does; without one the longest bar fills its cell. A table
	   with no bars yet - frame data still to come - gets no axis, rather than
	   one running from 0 to 1. */
	const { max, ticks } =
		axis && drawn.length
			? axisScale(longest, get("max"), get("step"))
			: { max: longest, ticks: null };
	const showValues = String(get("labels") ?? "auto") !== "off";

	const cell = (node) => {
		const sign = signClass(node.children);
		const properties = { ...node.properties };
		if (sign) properties.className = [...(properties.className || []), sign];
		return h(node.tagName, properties, renderInline(node.children));
	};

	const headCells = elements(headRow, "th", "td");
	const head = h("thead", [
		h("tr", [
			...headCells.slice(0, -1).map(cell),
			h("th", { class: "ft-frames" }, "Frame Data"),
		]),
	]);

	const tbody = h(
		"tbody",
		rows.map((row) => {
			/* Gridlines go in every row, drawn or not, so they run unbroken
			   down the column. */
			const plot = [
				...(ticks ? [buildGridlines(ticks, max)] : []),
				...(row.data?.main.length
					? [
							h(
								"div",
								{ class: "fc-row-plot" },
								buildRowLanes(row.data, max, { showValues, map }).lanes,
							),
						]
					: []),
			];
			return h("tr", [
				...row.cells.map(cell),
				h(row.frames?.tagName || "td", { class: "ft-frames" }, plot),
			]);
		}),
	);

	/* Whatever follows the table, if the table sits at the top level of the
	   body - which it does unless something was wrapped around it. */
	const tableAt = body.indexOf(table);
	const notes = tableAt === -1 ? [] : buildNotes(body.slice(tableAt + 1));
	const footRows = [];
	/* The axis sits under the bar column, its unit at the right-hand end of
	   the columns before it - level with the ticks, as on a framechart. */
	if (ticks) {
		footRows.push(
			h("tr", { class: "ft-axis-row" }, [
				...(headCells.length > 1
					? [
							h(
								"td",
								{ class: "ft-axis-unit", colSpan: headCells.length - 1 },
								get("unit") ?? "frames",
							),
						]
					: []),
				h("td", { class: "ft-frames ft-axis" }, [buildAxis(ticks, max)]),
			]),
		);
	}
	if (notes.length) {
		footRows.push(
			h("tr", [
				h("td", { class: "ft-notes", colSpan: headCells.length }, [
					h("div", { class: "ft-notes-body" }, notes),
				]),
			]),
		);
	}
	const foot = footRows.length ? h("tfoot", footRows) : null;

	const { legend, legendRight } = buildLegend(drawn, map, get("legend"));

	const parts = [];
	if (caption?.length) {
		parts.push(h("figcaption", { class: "fc-caption" }, caption));
	}
	if (inset) parts.push(inset);
	parts.push(
		h("div", { class: "fc-body" }, [
			h("table", { class: "ft-table" }, [head, tbody, ...(foot ? [foot] : [])]),
		]),
	);
	if (legend) parts.push(legend);

	return h(
		"figure",
		{
			class: `frame-chart frame-table${axis ? " frame-chartable" : ""} not-prose${legendRight ? " fc-legend-right" : ""}`,
		},
		parts,
	);
}
