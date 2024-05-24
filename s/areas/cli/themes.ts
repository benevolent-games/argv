
import {Theme} from "../../tooling/text/theming.js"
import {color} from "../../tooling/text/coloring.js"

//
// standard theme (default)
//

const standard = {
	plain: [color.white],
	error: [color.brightRed, color.bold],
	program: [color.brightCyan, color.bold],
	command: [color.cyan, color.bold],
	property: [color.magenta],
	link: [color.brightBlue, color.underline],
	arg: [color.brightGreen, color.bold],
	param: [color.brightYellow, color.bold],
	flag: [color.yellow],
	required: [color.red],
	mode: [color.blue],
	type: [color.brightBlue, color.bold],
	value: [color.magenta],
} satisfies Theme

//
// theme type
//

export type ArgvTheme = typeof standard

export function asTheme<T extends ArgvTheme>(t: T) {
	return t
}

export function asThemes<T extends Record<string, ArgvTheme>>(t: T) {
	return t
}


//
// more themes!
//

export const themes = asThemes({
	standard,

	noColor: Object.fromEntries(
		Object.entries(standard)
			.map(([key]) => [key, [(s: string) => s]])
	) as ArgvTheme,

	seaside: {
		plain: [color.white],
		error: [color.brightRed, color.bold],
		program: [color.brightCyan, color.bold],
		command: [color.cyan, color.bold],
		property: [color.blue],
		link: [color.brightBlue, color.underline],
		arg: [color.brightBlue, color.bold],
		param: [color.brightBlue, color.bold],
		flag: [color.brightBlue],
		required: [color.cyan],
		mode: [color.blue],
		type: [color.brightBlue],
		value: [color.cyan],
	},
})

