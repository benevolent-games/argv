
import {cli} from "./cli.js"
import {argv} from "../../testing/argv.js"
import {ExitFail} from "../../errors/basic.js"
import {CliConfig, cliConfig} from "./types.js"
import {expect} from "../../testing/framework/expect.js"
import {CommandTree} from "../analysis/types/commands.js"
import {testSuite} from "../../testing/framework/test-suite.js"
import {arg, command, number, param, string} from "../analysis/helpers.js"

function spyCli<C extends CommandTree>(argv: string[], config: CliConfig<C>) {
	const data = {
		exitCode: undefined as number | undefined,
		help: undefined as string | undefined,
		mistake: undefined as string | undefined,
	}
	try {
		const result = cli(argv, {
			...config,
			onExit: code => data.exitCode = code,
			onHelp: help => data.help = help,
			onMistake: mistake => data.mistake = mistake,
		})
		return {...data, ...result}
	}
	catch (error) {
		if (error instanceof ExitFail)
			return data
		else
			throw error
	}
}

export default testSuite({

	async "no inputs, no problem"() {
		const result = cli(argv(), {
			name: "example",
			commands: command({
				args: [],
				params: {},
			}),
		})
		expect().that(typeof result.execute).is("function")
		expect().that(typeof result.command).is("object")
		expect().that(typeof result.tree).is("object")
	},

	async "command execution"() {
		let executed = false
		const result = cli(argv("aaa --bravo bbb"), {
			name: "example",
			commands: command({
				args: [arg("alpha").required(string)],
				params: {bravo: param.required(string)},
				execute: async({args, params}) => {
					executed = true
					expect().that(args.alpha).is("aaa")
					expect().that(params.bravo).is("bbb")
				},
			}),
		})
		expect().that(executed).is(false)
		await result.execute()
		expect().that(executed).is(true)
	},

	async "command execution via sugary cli.execute"() {
		let executed = false
		await cli.execute(argv("aaa --bravo bbb"), {
			name: "example",
			commands: command({
				args: [arg("alpha").required(string)],
				params: {bravo: param.required(string)},
				execute: async({args, params}) => {
					executed = true
					expect().that(args.alpha).is("aaa")
					expect().that(params.bravo).is("bbb")
				},
			}),
		})
		expect().that(executed).is(true)
	},

	async "command execution, alternating"() {
		let calledHyrax = false
		let calledCapybara = false
		const config = cliConfig({
			name: "example",
			commands: {
				hyrax: command({
					args: [arg("alpha").required(string)],
					params: {bravo: param.required(string)},
					execute: async({args, params}) => {
						expect().that(args.alpha).is("aaa")
						expect().that(params.bravo).is("bbb")
						calledHyrax = true
					},
				}),
				capybara: command({
					args: [arg("charlie").required(string)],
					params: {delta: param.required(string)},
					execute: async({args, params}) => {
						expect().that(args.charlie).is("ccc")
						expect().that(params.delta).is("ddd")
						calledCapybara = true
					},
				}),
			},
		})

		const result1 = cli(argv("hyrax aaa --bravo bbb"), config)
		const result2 = cli(argv("capybara ccc --delta ddd"), config)
		expect().that(calledHyrax).is(false)
		expect().that(calledCapybara).is(false)

		await result1.execute()
		expect().that(calledHyrax).is(true)
		expect().that(calledCapybara).is(false)

		await result2.execute()
		expect().that(calledHyrax).is(true)
		expect().that(calledCapybara).is(true)
	},

	async "error handling"() {
		const config = cliConfig({
			name: "example",
			commands: {
				icecream: command({
					args: [],
					params: {scoops: param.required(number)},
				}),
				pizza: command({
					args: [],
					params: {slices: param.required(number)},
				}),
			},
		})
		expect("invalid number")
			.that(!!spyCli(argv("icecream --scoops=FAIL"), config)?.mistake?.length)
			.is(true)
		expect("missing required param")
			.that(!!spyCli(argv("icecream"), config)?.mistake?.length)
			.is(true)
	},

})

