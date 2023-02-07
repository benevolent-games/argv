
import {argv} from "./helpers/argv.js"
import {program} from "../../program.js"
import {expect} from "./framework/expect.js"
import {runTests} from "./framework/run-tests.js"
import {exampleConfig} from "./helpers/example-config.js"
import {commandTester} from "./helpers/command-tester.js"

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

	async "args are parsed"() {
		const {input} = commandTester({
			argorder: ["alpha", "bravo", "charlie"],
			params: {},
			args: {
				alpha: {mode: "requirement", type: String},
				bravo: {mode: "option", type: Number},
				charlie: {mode: "default", type: Boolean, default: true},
			},
		})

		expect("should fail without required param")
			.that((await input()).code)
			.is(-1)

		expect("should succeed with required param")
			.that((await input("hello")).code)
			.is(0)

		expect("should accept alpha")
			.that((await input("hello")).args.alpha)
			.is("hello")

		expect("should keep bravo undefined")
			.that((await input("hello")).args.bravo)
			.is(undefined)

		expect("should keep charlie true")
			.that((await input("hello")).args.charlie)
			.is(true)

		expect("should accept bravo")
			.that((await input("hello", "123", "false")).args.bravo)
			.is(123)

		expect("should accept charlie")
			.that((await input("hello", "123", "false")).args.charlie)
			.is(false)
	},

})
