
import {parse} from "./parse.js"
import {expect} from "../testing/framework/expect.js"
import {testSuite} from "../testing/framework/test-suite.js"

export default testSuite({

	//
	// basics
	//

	async "no inputs, no problem"() {
		const result = parse([])
		expect("zero args")
			.that(result.args.length)
			.is(0)
		expect("zero params")
			.that(result.params.size)
			.is(0)
		expect("zero flags")
			.that(result.flags.size)
			.is(0)
	},

	async "args"() {
		const result = parse(["alpha", "bravo"])
		expect("two args")
			.that(result.args.length)
			.is(2)
		expect("arg 0")
			.that(result.args[0])
			.is("alpha")
		expect("arg 1")
			.that(result.args[1])
			.is("bravo")
	},

	async "params"() {
		expect("multi-part")
			.that(parse(["--alpha", "bravo"]).params.get("alpha"))
			.is("bravo")
		expect("equal-sign")
			.that(parse(["--alpha=bravo"]).params.get("alpha"))
			.is("bravo")
		expect("equal-sign plus")
			.that(parse(["--alpha=bravo=lol"]).params.get("alpha"))
			.is("bravo=lol")
	},

	async "param errors"() {
		expect("open-ended")
			.that(() => parse(["--alpha"]))
			.throws()
		expect("double or nothing")
			.that(() => parse(["--alpha --bravo rofl"]))
			.throws()
	},

	async "multiple params"() {
		{
			const result = parse(["--alpha=a", "--bravo=b"])
			expect("1").that(result.params.get("alpha")).is("a")
			expect("2").that(result.params.get("bravo")).is("b")
		}
		{
			const result = parse(["--alpha", "a", "--bravo", "b"])
			expect("3").that(result.params.get("alpha")).is("a")
			expect("4").that(result.params.get("bravo")).is("b")
		}
	},

	async "boolean params"() {
		const options = {booleanParams: ["alpha"]}
		{
			const result = parse(["--alpha=a", "--bravo=b"], options)
			expect("1").that(result.params.get("alpha")).is("a")
			expect("2").that(result.params.get("bravo")).is("b")
		}
		{
			const result = parse(["--alpha", "myArg", "--bravo=b"], options)
			expect("3").that(result.params.get("alpha")).is("true")
			expect("4").that(result.params.get("bravo")).is("b")
			expect("5").that(result.args[0]).is("myArg")
		}
	},

	async "args after double-dash"() {
		const result = parse(["alpha", "--", "--bravo"])
		expect("zero params")
			.that(result.params.size)
			.is(0)
		expect("two args")
			.that(result.args.length)
			.is(2)
		expect("bravo keeps its prefix")
			.that(result.args[1])
			.is("--bravo")
	},

	async "flags"() {
		{
			const result = parse(["-a", "-b"])
			expect().that(result.flags.has("a")).is(true)
			expect().that(result.flags.has("b")).is(true)
		}
		{
			const result = parse(["-abc", "-xyz"])
			expect().that(result.flags.has("a")).is(true)
			expect().that(result.flags.has("b")).is(true)
			expect().that(result.flags.has("c")).is(true)
			expect().that(result.flags.has("x")).is(true)
			expect().that(result.flags.has("y")).is(true)
			expect().that(result.flags.has("z")).is(true)
		}
	},

	async "chaos"() {
		const result = parse([
			"alpha",
			"--bravo=charlie",
			"delta",
			"--echo",
			"foxtrot",
			"-gh",
			"india",
			"-j",
		])

		expect().that(result.args.length).is(3)
		expect().that(result.args[0]).is("alpha")
		expect().that(result.args[1]).is("delta")
		expect().that(result.args[2]).is("india")

		expect().that(result.params.size).is(2)
		expect().that(result.params.get("bravo")).is("charlie")
		expect().that(result.params.get("echo")).is("foxtrot")

		expect().that(result.flags.size).is(3)
		expect().that(result.flags.has("g")).is(true)
		expect().that(result.flags.has("h")).is(true)
		expect().that(result.flags.has("j")).is(true)
	},
})

