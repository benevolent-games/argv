
import {parse} from "./parse.js"
import {argv} from "./testing/argv.js"
import {arg, args, command, params} from "./helpers.js"
import {expect} from "../../tooling/testing/framework/expect.js"
import {runTests} from "../../tooling/testing/framework/run-tests.js"

await runTests({

	//
	// basics
	//

	async "no inputs, no problem"() {
		parse({argv: argv(), commands: command("", args(), params({}))})
		parse({argv: argv("extra"), commands: command("", args(), params({}))})
	},

	//
	// args
	//

	async "arg.required"() {
		expect("we can read the arg")
			.that(
				parse({
					argv: argv("pepperoni"),
					commands: command("",
						args(arg.required("topping", String, "")),
						params({}),
					),
				})
				.tree.args.topping
			)
			.is("pepperoni")
		expect("error is thrown when requirement is not met")
			.that(() =>
				parse({
					argv: argv(),
					commands: command("",
						args(arg.required("topping", String, "")),
						params({}),
					),
				})
			)
			.throws()
	},

	async "arg.optional"() {
		void 0
	},

	async "arg.default"() {
		void 0
	},

	//
	// params
	//

	async "param.required"() {
		void 0
	},

	async "param.optional"() {
		void 0
	},

	async "param.default"() {
		void 0
	},
})

