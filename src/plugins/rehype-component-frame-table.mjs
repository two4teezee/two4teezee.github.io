/// <reference types="mdast" />
import { h } from "hastscript";
import {
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

export function FrameTableComponent(properties, children) {
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

	const table = findTable(body);
	const headRow = elements(elements(table, "thead")[0], "tr")[0];
	if (!headRow) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid frametable directive. (Must be ":::frametable{}" wrapping a markdown table whose last column is "phase=frames" data.)',
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
			`[frametable] ignored, not a "phase=frames" token: ${warnings.join(" | ")}`,
		);
	}

	const drawn = rows.map((row) => row.data).filter((data) => data?.main.length);
	const max = Math.max(1, ...drawn.map(rowEnd));
	const showValues = String(get("labels") ?? "auto") !== "off";

	/* A value that leads with its sign - frame advantage, mostly - is
	   coloured by it. A bare `-`, the usual "no value", is left alone. */
	const signClass = (node) => {
		const text = itemsText(collectItems(node.children)).trim();
		if (/^\+./.test(text)) return "ft-plus";
		if (/^[-−]./.test(text)) return "ft-minus";
		return null;
	};

	const cell = (node) => {
		const sign = signClass(node);
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
			const plot = row.data?.main.length
				? [
						h(
							"div",
							{ class: "fc-row-plot" },
							buildRowLanes(row.data, max, { showValues, map }).lanes,
						),
					]
				: [];
			return h("tr", [
				...row.cells.map(cell),
				h(row.frames?.tagName || "td", { class: "ft-frames" }, plot),
			]);
		}),
	);

	const { legend, legendRight } = buildLegend(drawn, map, get("legend"));

	const parts = [];
	if (caption?.length) {
		parts.push(h("figcaption", { class: "fc-caption" }, caption));
	}
	parts.push(
		h("div", { class: "fc-body" }, [
			h("table", { class: "ft-table" }, [head, tbody]),
		]),
	);
	if (legend) parts.push(legend);

	return h(
		"figure",
		{
			class: `frame-chart frame-table not-prose${legendRight ? " fc-legend-right" : ""}`,
		},
		parts,
	);
}
