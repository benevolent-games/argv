
import {NuSpec} from "../../../program.js"

export const simple = (...args: string[]) => ({
	name: "simple",
	argv: ["node", "./script.js", ...args],
	columns: 72,

	readme: "https://benevolent.games/fake-example",
	help: `simple example program`,

	commands: command => command({
		help: `basic operation`,
		argorder: ["speed"],
		args: {
			speed: {
				type: Number,
				mode: "requirement",
				help: "pick a number, any number",
			},
		},
		params: {},
	}),
} satisfies NuSpec)
