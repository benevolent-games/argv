
import {color, colorHex} from "../tooling/text/coloring.js"

//
// theme type
//

export type ArgvTheme = typeof standard

//
// standard theme (default)
//

const standard = {
	program: [color.brightCyan, color.bold],
	command: [color.cyan],
	arg: [color.brightGreen],
	param: [color.brightYellow],
	flag: [color.yellow],
	mode: [color.blue],
	required: [color.red],
	type: [color.blue],
	value: [color.blue],
	got: [color.yellow],
}

//
// more themes!
//

export const themes = {

	standard,

	dracula: {
		...standard,
		program: [colorHex("#80f"), color.bold],
		command: [color.blue, color.bold],
	},

} satisfies Record<string, ArgvTheme>

