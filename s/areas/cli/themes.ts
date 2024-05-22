
import {color, colorHex} from "../../tooling/text/coloring.js"

//
// theme type
//

export type ArgvTheme = typeof standard

//
// standard theme (default)
//

const standard = {
	program: [color.brightCyan, color.bold],
	command: [color.cyan, color.bold],
	property: [color.magenta, color.bold],
	link: [color.brightBlue, color.underline],
	arg: [color.brightGreen, color.bold],
	param: [color.brightYellow, color.bold],
	flag: [color.yellow],
	required: [color.red],
	mode: [color.blue],
	type: [color.magenta],
	value: [color.blue],
}

//
// more themes!
//

export const themes = {

	standard,

	noColor: Object.fromEntries(
		Object.entries(standard)
			.map(([key]) => [key, [(s: string) => s]])
	) as ArgvTheme,

	// todo
	dracula: {
		...standard,
		program: [colorHex("#80f"), color.bold],
		command: [color.blue, color.bold],
	},

} satisfies Record<string, ArgvTheme>

