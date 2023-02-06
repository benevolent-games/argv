
import {argv} from "./helpers/argv.js"
import {program} from "../../program.js"
import {expect} from "./framework/expect.js"
import {runTests} from "./framework/run-tests.js"
import {exampleConfig} from "./helpers/example-config.js"

await runTests({

	async "empty program takes no inputs"() {
		let ran = false

		const {code, error} = await program({
			...exampleConfig(),
			argv: argv(),
			commands: command => command({
				argorder: [],
				args: {},
				params: {},
				async execute() {
					ran = true
				},
			}),
		})

		expect("ran successfully")
			.that(ran)
			.is(true)

		expect("exit code should be zero")
			.that(code)
			.is(0)

		expect("no error")
			.that(error)
			.is(undefined)
	},

	// async "arguments are parsed"() {
	// 	const {code, error} = await program({
	// 		...exampleConfig(),
	// 		argv: argv("hello"),
	// 		commands: command => command({
	// 			argorder: ["alpha"],
	// 			args: {
	// 				alpha: {
	// 					type: String,
	// 					mode: "option",
	// 				},
	// 			},
	// 			params: {},
	// 			async execute({args}) {
	// 				expect("alpha is 'hello'")
	// 					.that(args.alpha)
	// 					.is("hello")
	// 			},
	// 		}),
	// 	})
	// },

})
