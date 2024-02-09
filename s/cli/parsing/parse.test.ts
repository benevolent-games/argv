
import {expect} from "../../tooling/testing/framework/expect.js"
import {parse} from "./parse.js"
import {runTests} from "../../tooling/testing/framework/run-tests.js"
import {argv} from "./testing/argv.js"
import {args, command, params} from "./helpers.js"

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
		const result = parse({
			argv: argv("pepperoni"),
			commands: command("", args(), params({})),
		})
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

	// async "args are parsed"() {
	// 	const {input} = commandTester({
	// 		argorder: ["alpha", "bravo", "charlie"],
	// 		params: {},
	// 		args: {
	// 			alpha: {mode: "requirement", type: String},
	// 			bravo: {mode: "option", type: Number},
	// 			charlie: {mode: "default", type: Boolean, default: true},
	// 		},
	// 	})

	// 	expect("should fail without required param")
	// 		.that((await input()).code)
	// 		.is(1)

	// 	expect("should succeed with required param")
	// 		.that((await input("hello")).code)
	// 		.is(0)

	// 	expect("should accept alpha")
	// 		.that((await input("hello")).args.alpha)
	// 		.is("hello")

	// 	expect("should keep bravo undefined")
	// 		.that((await input("hello")).args.bravo)
	// 		.is(undefined)

	// 	expect("should keep charlie true")
	// 		.that((await input("hello")).args.charlie)
	// 		.is(true)

	// 	expect("should accept bravo")
	// 		.that((await input("hello", "123", "false")).args.bravo)
	// 		.is(123)

	// 	expect("should accept charlie")
	// 		.that((await input("hello", "123", "false")).args.charlie)
	// 		.is(false)
	// },

	// async "params are parsed"() {
	// 	const {input} = commandTester({
	// 		argorder: [],
	// 		args: {},
	// 		params: {
	// 			alpha: {mode: "requirement", type: String},
	// 			bravo: {mode: "option", type: Number},
	// 			charlie: {mode: "default", type: Boolean, default: true},
	// 		},
	// 	})

	// 	expect("should fail without required param")
	// 		.that((await input()).code)
	// 		.is(1)

	// 	expect("should succeed with required param")
	// 		.that((await input("--alpha", "hello")).code)
	// 		.is(0)

	// 	expect("should accept alpha param")
	// 		.that((await input("--alpha", "hello")).params.alpha)
	// 		.is("hello")

	// 	expect("should keep bravo undefined")
	// 		.that((await input("--alpha", "hello")).params.bravo)
	// 		.is(undefined)

	// 	expect("should fallback charlie to true")
	// 		.that((await input("--alpha", "hello")).params.charlie)
	// 		.is(true)

	// 	expect("should accept bravo")
	// 		.that((await input("--alpha", "hello", "--bravo", "123")).params.bravo)
	// 		.is(123)

	// 	expect("should accept charlie")
	// 		.that((await input("--alpha", "hello", "--charlie", "false")).params.charlie)
	// 		.is(false)
	// },

	// async "param assignment syntax"() {
	// 	const {input} = commandTester({
	// 		args: {},
	// 		argorder: [],
	// 		params: {alpha: {mode: "requirement", type: String}},
	// 	})

	// 	async function param(...i: string[]) {
	// 		const {params} = await input(...i)
	// 		return params.alpha
	// 	}

	// 	expect("ordinary syntax should parse")
	// 		.that(await param("--alpha", "hello"))
	// 		.is("hello")

	// 	expect("equal-signed syntax should parse")
	// 		.that(await param("--alpha=hello world"))
	// 		.is("hello world")
	// },

	// async "boolean param assignment"() {
	// 	const {input} = commandTester({
	// 		args: {},
	// 		argorder: [],
	// 		params: {alpha: {mode: "option", type: Boolean}},
	// 	})

	// 	async function param(...i: string[]) {
	// 		const {params} = await input(...i)
	// 		return params.alpha
	// 	}

	// 	expect("unset option should be undefined")
	// 		.that(await param())
	// 		.is(undefined)

	// 	expect("plus syntax should enable boolean")
	// 		.that(await param("+alpha"))
	// 		.is(true)

	// 	expect("'yes' should be a synonym for 'true'")
	// 		.that(await param("--alpha", "yes"))
	// 		.is(true)
	// },

	// async "thisTuple startsWith"() {
	// 	expect("abc starts with a")
	// 		.that(thisTuple(["a", "b", "c"]).startsWith(["a"]))
	// 		.is(true)

	// 	expect("abc starts with ab")
	// 		.that(thisTuple(["a", "b", "c"]).startsWith(["a", "b"]))
	// 		.is(true)

	// 	expect("abc starts with abc")
	// 		.that(thisTuple(["a", "b", "c"]).startsWith(["a", "b", "c"]))
	// 		.is(true)

	// 	expect("abc does not start with abcd")
	// 		.that(thisTuple(["a", "b", "c"]).startsWith(["a", "b", "c", "d"]))
	// 		.is(true)

	// 	expect("abc does not start with z")
	// 		.that(thisTuple(["a", "b", "c"]).startsWith(["z"]))
	// 		.is(true)

	// 	expect("abc does not start with <empty>")
	// 		.that(thisTuple(["a", "b", "c"]).startsWith([]))
	// 		.is(true)

	// 	expect("<empty> does not start with a")
	// 		.that(thisTuple([]).startsWith(["a"]))
	// 		.is(true)
	// },

})

