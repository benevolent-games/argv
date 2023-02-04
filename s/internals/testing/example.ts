
import {stdtheme} from "../../theme.js"
import {program7, program8} from "../../program2.js"

await program8()({
	name: "pack",

	logger: console,
	argv: process.argv,
	columns: process.stdout.columns ?? 72,
	// exit: code => process.exit(code),
	exit: false,

	help: ``,
	readme: "",
	tips: true,
	theme: stdtheme,

	commands: command => ({
		check: command({
			help: ``,
			// argorder: ["packname", "version"],
			argorder: ["lol"],
			args: {
				lol: {
					type: String,
					mode: "requirement",
					help: "",
				},
				// packname: {
				// 	type: String,
				// 	mode: "default",
				// 	default: ".",
				// 	help: ``,
				// },
				// version: {
				// 	type: String,
				// 	mode: "default",
				// 	default: "*",
				// 	help: `semver specifier for which version you want`,
				// }
			},
			params: {},
			async execute({args, params}) {
				console.log("hello")
			},
		})
		// check: command({
		// 	help: `get information about a pack`,
		// 	argorder: ["packname", "version"],
		// 	args: {
		// 		packname: {
		// 			type: String,
		// 			mode: "default",
		// 			default: ".",
		// 			help: `query the cloud for info about a pack`,
		// 		},
		// 		version: {
		// 			type: String,
		// 			mode: "default",
		// 			default: "*",
		// 			help: `semver specifier for which version you want`,
		// 		},
		// 	},
		// 	params: {
		// 		lol: {
		// 			type: Number,
		// 			mode: "option",
		// 			help: ``,
		// 		},
		// 	},
		// 	async execute({args, params, cmd}) {
		// 		console.log(cmd, args, params)
		// 	},
		// }),
	}),
})
