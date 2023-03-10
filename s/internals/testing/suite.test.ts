
import {tools} from "./rig/tools.js"
import {expect} from "./utils/expect.js"
import {testCli} from "./rig/test-cli.js"
import {runTests} from "./utils/run-tests.js"

runTests({

	async "empty program takes no inputs"() {
		const {args, params} = tools(testCli()({
			argorder: [],
			args: {},
			params: {},
		}))

		expect("should see no args")
			.that(Object.keys(args).length)
			.is(0)

		expect("should see no params")
			.that(Object.keys(params).length)
			.is(0)
	},

	async "arguments"() {
		const {args, exitCode} = tools(testCli()({
			argorder: ["alpha", "bravo", "charlie"],
			params: {},
			args: {
				alpha: {mode: "requirement", type: String},
				bravo: {mode: "option", type: Number},
				charlie: {mode: "default", type: Boolean, default: true},
			},
		}))

		expect("should fail without required param")
			.that(exitCode())
			.is(1)

		expect("should succeed with required param")
			.that(exitCode("hello"))
			.is(undefined)

		expect("should accept alpha")
			.that(args("hello").alpha)
			.is("hello")

		expect("should keep bravo undefined")
			.that(args("hello").bravo)
			.is(undefined)

		expect("should keep charlie true")
			.that(args("hello").charlie)
			.is(true)

		expect("should accept bravo")
			.that(args("hello", "123", "false").bravo)
			.is(123)

		expect("should accept charlie")
			.that(args("hello", "123", "false").charlie)
			.is(false)
	},

	async "parameters"() {
		const {params, exitCode} = tools(testCli()({
			args: {},
			argorder: [],
			params: {
				alpha: {mode: "requirement", type: String},
				bravo: {mode: "option", type: Number},
				charlie: {mode: "default", type: Boolean, default: true},
			},
		}))

		expect("should fail without required param")
			.that(exitCode())
			.is(1)

		expect("should succeed with required param")
			.that(exitCode("--alpha", "hello"))
			.is(undefined)

		expect("should accept alpha param")
			.that(params("--alpha", "hello").alpha)
			.is("hello")

		expect("should keep bravo undefined")
			.that(params("--alpha", "hello").bravo)
			.is(undefined)

		expect("should fallback charlie to true")
			.that(params("--alpha", "hello").charlie)
			.is(true)

		expect("should accept bravo")
			.that(params("--alpha", "hello", "--bravo", "123").bravo)
			.is(123)

		expect("should accept charlie")
			.that(params("--alpha", "hello", "--charlie", "false").charlie)
			.is(false)
	},

	async "parameter assignment syntax"() {
		const {params} = tools(testCli()({
			args: {},
			argorder: [],
			params: {alpha: {mode: "requirement", type: String}},
		}))
		const param = (...args: string[]) => params(...args).alpha

		expect("ordinary syntax should parse")
			.that(param("--alpha", "hello"))
			.is("hello")

		expect("equal-signed syntax should parse")
			.that(param("--alpha=hello world"))
			.is("hello world")
	},

	async "boolean param assignment"() {
		const {params} = tools(testCli()({
			args: {},
			argorder: [],
			params: {alpha: {mode: "option", type: Boolean}},
		}))
		const param = (...args: string[]) => params(...args).alpha

		expect("unset option should be undefined")
			.that(param())
			.is(undefined)

		expect("plus syntax should enable boolean")
			.that(param("+alpha"))
			.is(true)

		expect("'yes' should be a synonym for 'true'")
			.that(param("--alpha", "yes"))
			.is(true)
	},

	async "--help magically works"() {
		const {exitCode} = tools(testCli()({
			args: {},
			argorder: [],
			params: {},
		}))

		expect("should exit with code 0")
			.that(exitCode("--help"))
			.is(0)
	},
})
