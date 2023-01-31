
import {stdtheme} from "../../theme.js"
import {program2} from "../../program2.js"

await program2("pack")

.environment({
	logger: console,
	argv: process.argv,
	columns: process.stdout.columns ?? 72,
	exit: code => process.exit(code),
})

.settings({
	help: ``,
	readme: "",
	tips: true,
	theme: stdtheme,
})

.command("check", {
	help: `get information about a pack`,
	argorder: ["packname", "version"],
	args: {
		packname: {
			type: String,
			mode: "default",
			default: ".",
			help: `query the cloud for info about a pack`,
		},
		version: {
			type: String,
			mode: "default",
			default: "*",
			help: `semver specifier for which version you want`,
		},
	},
	params: {
		lol: {
			type: Number,
			mode: "option",
			help: ``,
		},
	},
	async execute({args, params}) {
		console.log("check", args, params)
	},
})

.wait()
