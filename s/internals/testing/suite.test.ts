
import {assert} from "./utils/assert.js"
import {stdargv} from "./utils/stdargv.js"
import {testCli} from "./utils/test-cli.js"
import {runTests} from "./utils/run-tests.js"

runTests({

	async "empty program takes no inputs"() {
		const {args, params} = testCli()({
			argorder: [],
			args: {},
			params: {},
		})(stdargv()).command
		assert("should see no args", Object.keys(args).length === 0)
		assert("should see no params", Object.keys(params).length === 0)
	},

	async "arguments (optional)"() {
		const cli = testCli()({
			argorder: ["alpha", "bravo", "charlie"],
			params: {},
			args: {
				alpha: {mode: "option", type: String},
				bravo: {mode: "option", type: Number},
				charlie: {mode: "option", type: Boolean},
			},
		})

		{
			const {args} = cli(stdargv()).command
			assert("should see no args", Object.keys(args).length === 0)
		}

		{
			const {args} = cli(stdargv("hello", "123", "true")).command
			assert("alpha should be 'hello'", args.alpha === "hello")
			assert("bravo should be 123", args.bravo === 123)
			assert("charlie should be true", args.charlie === true)
		}

		{
			const {args} = cli(stdargv("hello")).command
			assert("alpha should be 'hello'", args.alpha === "hello")
			assert("bravo should be undefined", args.bravo === undefined)
			assert("charlie should be undefined", args.charlie === undefined)
		}
	},

	async "arguments (required)"() {
		const cli = testCli()({
			argorder: ["alpha", "bravo", "charlie"],
			params: {},
			args: {
				alpha: {mode: "requirement", type: String},
				bravo: {mode: "requirement", type: Number},
				charlie: {mode: "requirement", type: Boolean},
			},
		})
		const run = (...args: string[]) => cli(stdargv(...args))
		assert("should fail without args", run().exitCode === 1)
		assert("should fail missing one arg", run("hello", "123").exitCode === 1)
		{
			const {exitCode, command: {args}} = run("hello", "123", "true")
			assert("exit code should be undefined", exitCode === undefined)
			assert("alpha should be 'hello'", args.alpha === "hello")
			assert("bravo should be 123", args.bravo === 123)
			assert("charlie should be true", args.charlie === true)
		}
	},

	async "arguments (default)"() {
		const cli = testCli()({
			argorder: ["alpha", "bravo", "charlie"],
			params: {},
			args: {
				alpha: {mode: "default", type: String, default: "hello"},
				bravo: {mode: "default", type: Number, default: 123},
				charlie: {mode: "default", type: Boolean, default: true},
			},
		})
		const run = (...args: string[]) => cli(stdargv(...args))
		assert("should not fail", run().exitCode === undefined)
		{
			const {command: {args}} = run("world")
			assert("alpha should overwrite to 'hello'", args.alpha === "world")
			assert("bravo should fallback to 123", args.bravo === 123)
			assert("charlie should fallback to true", args.charlie === true)
		}
	},

	async "parameters"() {
		const cli = testCli()({
			argorder: [],
			params: {
				"--alpha": {mode: "requirement", type: String},
				"--bravo": {mode: "option", type: Number},
				"--charlie": {mode: "default", type: Boolean, default: true},
			},
			args: {},
		})
		const run = (...args: string[]) => cli(stdargv(...args))

		assert("should fail without required param", run().exitCode === 1)
		assert("should succeed with required param", run().exitCode === 0)

		assert(
			"should accept alpha param",
			run("hello").command.params["--alpha"] === "hello",
		)

		assert(
			"should keep bravo undefined",
			run("hello").command.params["--bravo"] === undefined,
		)

		assert(
			"should fallback charlie to true",
			run("hello").command.params["--charlie"] === true,
		)

		assert(
			"should accept bravo",
			run("hello", "123", "false").command.params["--bravo"] === 123,
		)

		assert(
			"should accept charlie",
			run("hello", "123", "false").command.params["--charlie"] === false,
		)
	},

	async "parameters (required)"() {},

	async "parameters (default)"() {},
})
