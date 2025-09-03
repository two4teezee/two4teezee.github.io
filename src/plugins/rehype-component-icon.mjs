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

	const sizeStyle = size ? `width:${size}px;height:${size}px;` : "";
	const displayStyle = inline
		? "display:inline-block;vertical-align:text-bottom;"
		: "";

	return h("img", {
		src: url,
		alt,
		class: `md-icon${className ? " " + className : ""}`,
		style: `${displayStyle}${sizeStyle}${style}`,
		loading: "lazy",
		decoding: "async",
	});
}
