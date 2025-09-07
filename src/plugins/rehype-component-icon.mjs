import { h } from "hastscript";

export function IconImageComponent(properties, _children) {
	const {
		src,
		name,
		ext = "png",
		size, // px
		alt = "",
		class: className,
		inline = true,
		style = "",
	} = properties || {};

	const url = src || (name ? `/icons/${name}.${ext}` : null);
	if (!url) {
		return h("span", { class: "hidden" }, 'icon: missing "src" or "name"');
	}

	// Support rectangular icons: allow width/height (or w/h). Fallback to size.
	const widthProp = properties.width ?? properties.w;
	const heightProp = properties.height ?? properties.h;

	const isNumeric = (v) =>
		typeof v === "number" || /^\d+(\.\d+)?$/.test(String(v));
	const toCssSize = (v) => (isNumeric(v) ? `${v}px` : String(v));

	const widthCss =
		widthProp != null
			? toCssSize(widthProp)
			: size != null
				? `${size}px`
				: undefined;
	const heightCss =
		heightProp != null
			? toCssSize(heightProp)
			: size != null
				? `${size}px`
				: undefined;

	const sizeStyle = `${widthCss ? `width:${widthCss};` : ""}${heightCss ? `height:${heightCss};` : ""}`;
	const displayStyle = inline
		? "display:inline-block;vertical-align:text-bottom;"
		: "";

	/** @type {Record<string, any>} */
	const attrs = {
		src: url,
		alt,
		class: `not-prose md-icon${className ? " " + className : ""}`,
		style: `${displayStyle}${sizeStyle}line-height:0;${style}margin:0 !important;`,
		loading: "lazy",
		decoding: "async",
	};

	if (isNumeric(widthProp ?? size))
		attrs.width = Math.round(Number(widthProp ?? size));
	if (isNumeric(heightProp ?? size))
		attrs.height = Math.round(Number(heightProp ?? size));

	return h("img", attrs);
}
