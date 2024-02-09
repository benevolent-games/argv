
import {argv} from "./helpers/argv.js"
import {program} from "../../program.js"
import {expect} from "./framework/expect.js"
import {runTests} from "./framework/run-tests.js"
import {exampleConfig} from "./helpers/example-config.js"
import {commandTester} from "./helpers/command-tester.js"
import {thisTuple} from "../parsing/program/this-tuple.js"

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
			.is(1)

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

	async "params are parsed"() {
		const {input} = commandTester({
			argorder: [],
			args: {},
			params: {
				alpha: {mode: "requirement", type: String},
				bravo: {mode: "option", type: Number},
				charlie: {mode: "default", type: Boolean, default: true},
			},
		})

		expect("should fail without required param")
			.that((await input()).code)
			.is(1)

		expect("should succeed with required param")
			.that((await input("--alpha", "hello")).code)
			.is(0)

		expect("should accept alpha param")
			.that((await input("--alpha", "hello")).params.alpha)
			.is("hello")

		expect("should keep bravo undefined")
			.that((await input("--alpha", "hello")).params.bravo)
			.is(undefined)

		expect("should fallback charlie to true")
			.that((await input("--alpha", "hello")).params.charlie)
			.is(true)

		expect("should accept bravo")
			.that((await input("--alpha", "hello", "--bravo", "123")).params.bravo)
			.is(123)

		expect("should accept charlie")
			.that((await input("--alpha", "hello", "--charlie", "false")).params.charlie)
			.is(false)
	},

	async "param assignment syntax"() {
		const {input} = commandTester({
			args: {},
			argorder: [],
			params: {alpha: {mode: "requirement", type: String}},
		})

		async function param(...i: string[]) {
			const {params} = await input(...i)
			return params.alpha
		}

		expect("ordinary syntax should parse")
			.that(await param("--alpha", "hello"))
			.is("hello")

		expect("equal-signed syntax should parse")
			.that(await param("--alpha=hello world"))
			.is("hello world")
	},

	async "boolean param assignment"() {
		const {input} = commandTester({
			args: {},
			argorder: [],
			params: {alpha: {mode: "option", type: Boolean}},
		})

		async function param(...i: string[]) {
			const {params} = await input(...i)
			return params.alpha
		}

		expect("unset option should be undefined")
			.that(await param())
			.is(undefined)

		expect("plus syntax should enable boolean")
			.that(await param("+alpha"))
			.is(true)

		expect("'yes' should be a synonym for 'true'")
			.that(await param("--alpha", "yes"))
			.is(true)
	},

	async "thisTuple startsWith"() {
		expect("abc starts with a")
			.that(thisTuple(["a", "b", "c"]).startsWith(["a"]))
			.is(true)

		expect("abc starts with ab")
			.that(thisTuple(["a", "b", "c"]).startsWith(["a", "b"]))
			.is(true)

		expect("abc starts with abc")
			.that(thisTuple(["a", "b", "c"]).startsWith(["a", "b", "c"]))
			.is(true)

		expect("abc does not start with abcd")
			.that(thisTuple(["a", "b", "c"]).startsWith(["a", "b", "c", "d"]))
			.is(true)

		expect("abc does not start with z")
			.that(thisTuple(["a", "b", "c"]).startsWith(["z"]))
			.is(true)

		expect("abc does not start with <empty>")
			.that(thisTuple(["a", "b", "c"]).startsWith([]))
			.is(true)

		expect("<empty> does not start with a")
			.that(thisTuple([]).startsWith(["a"]))
			.is(true)
	},

})

