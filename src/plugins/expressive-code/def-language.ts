import { definePlugin } from "@expressive-code/core";

// MUGEN DEF Language Plugin for Expressive Code
// Highlights typical INI-like syntax used by M.U.G.E.N character and stage .def files

export function pluginDefLanguage() {
	return definePlugin({
		name: "MUGEN DEF Language Support",
		hooks: {
			// Empty hooks for now - just register the plugin
		},
	});
}

export const defLang = {
	displayName: "MUGEN DEF",
	name: "def",
	patterns: [
		// Line comments starting with ; (primary in MUGEN) and # (occasionally used)
		{
			name: "comment.line.semicolon.def",
			match: ";.*$",
		},
		{
			name: "comment.line.number-sign.def",
			match: "#.*$",
		},

		// Section headers like [Info], [Files], [Palette], [BGDef], [Camera], etc.
		{
			name: "entity.name.section.def",
			match: "^\\s*\\[[^\\]]+\\]",
		},

		// Key names at the start of a line before '='
		{
			name: "variable.other.key.def",
			match: "^(\\s*[A-Za-z_][\\w.-]*)(?=\\s*=)",
		},

		// Common/known keys (for a richer highlight)
		{
			name: "keyword.other.def",
			match:
				"\\b(name|displayname|author|versiondate|mugenversion|localcoord|sprite|spr|air|snd|sound|cmd|cns|st|stcommon|pal|pal.defaults|palette|arcade|music|bgm|intro|ending|files|bgdef|playerinfo|camera|scaling|boundleft|boundright|boundhigh|boundlow|floortension|verticalfollow|startx|starty|teamside|life|lifemax|powermax)\\b",
		},

		// Values: file paths with common extensions
		{
			name: "string.path.def",
			match: "\\b[\\w./\\\\-]+\\.(sff|air|snd|def|act|spr|cns|cmd)\\b",
		},

		// String literals (double and single quotes)
		{
			name: "string.quoted.double.def",
			begin: '"',
			end: '"',
			patterns: [
				{
					name: "constant.character.escape.def",
					match: "\\\\.",
				},
			],
		},
		{
			name: "string.quoted.single.def",
			begin: "'",
			end: "'",
			patterns: [
				{
					name: "constant.character.escape.def",
					match: "\\\\.",
				},
			],
		},

		// Numbers
		{
			name: "constant.numeric.def",
			match: "\\b-?\\d+(?:\\.\\d+)?\\b",
		},

		// Booleans / toggles commonly used in configs
		{
			name: "constant.language.boolean.def",
			match: "\\b(true|false|on|off|yes|no)\\b",
		},

		// Operators and separators
		{
			name: "keyword.operator.assignment.def",
			match: "=",
		},
		{
			name: "punctuation.separator.list.def",
			match: ",",
		},
	],
	scopeName: "source.def",
};
