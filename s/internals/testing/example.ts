
import {stdtheme} from "../../theme.js"
import {program7} from "../../program2.js"

await program7({
	name: "pack",

	logger: console,
	argv: process.argv,
	columns: process.stdout.columns ?? 72,
	exit: false,

	help: ``,
	readme: "",
	tips: true,
	theme: stdtheme,

	commands: command => ({
		check: command({
			help: ``,
			argorder: ["packname", "version"],
			args: {
				packname: {
					type: String,
					mode: "default",
					default: ".",
					help: ``,
				},
				version: {
					type: String,
					mode: "default",
					default: "*",
					help: `semver specifier for which version you want`,
				}
			},
			params: {},
			async execute({args, params}) {
				console.log("hello")
			},
		})
	}),
})
