
import {cli} from "./cli.js"
import {cliConfig} from "./types.js"
import {argv} from "../testing/argv.js"
import {expect} from "../testing/framework/expect.js"
import {arg, command, param} from "../analysis/helpers.js"
import {testSuite} from "../testing/framework/test-suite.js"

const columns = 72

export default testSuite({

	// async "no inputs, no problem"() {
	// 	const result = cli(argv(), {
	// 		name: "example",
	// 		columns,
	// 		commands: command({
	// 			args: [],
	// 			params: {},
	// 		}),
	// 	})
	// 	expect().that(typeof result.execute).is("function")
	// 	expect().that(typeof result.command).is("object")
	// 	expect().that(typeof result.tree).is("object")
	// },

	// async "command execution"() {
	// 	const result = cli(argv("aaa --bravo bbb"), {
	// 		name: "example",
	// 		columns,
	// 		commands: command({
	// 			args: [arg.required("alpha", String)],
	// 			params: {bravo: param.required(String)},
	// 			execute: async({args, params}) => {
	// 				expect().that(args.alpha).is("aaa")
	// 				expect().that(params.bravo).is("bbb")
	// 			},
	// 		}),
	// 	})
	// 	await result.execute()
	// },

	// async "command execution, alternating"() {
	// 	let calledHyrax = false
	// 	let calledCapybara = false
	// 	const config = cliConfig({
	// 		name: "example",
	// 		columns,
	// 		commands: {
	// 			hyrax: command({
	// 				args: [arg.required("alpha", String)],
	// 				params: {bravo: param.required(String)},
	// 				execute: async({args, params}) => {
	// 					expect().that(args.alpha).is("aaa")
	// 					expect().that(params.bravo).is("bbb")
	// 					calledHyrax = true
	// 				},
	// 			}),
	// 			capybara: command({
	// 				args: [arg.required("charlie", String)],
	// 				params: {delta: param.required(String)},
	// 				execute: async({args, params}) => {
	// 					expect().that(args.charlie).is("ccc")
	// 					expect().that(params.delta).is("ddd")
	// 					calledCapybara = true
	// 				},
	// 			}),
	// 		},
	// 	})

	// 	const result1 = cli(argv("hyrax aaa --bravo bbb"), config)
	// 	const result2 = cli(argv("capybara ccc --delta ddd"), config)
	// 	expect().that(calledHyrax).is(false)
	// 	expect().that(calledCapybara).is(false)

	// 	await result1.execute()
	// 	expect().that(calledHyrax).is(true)
	// 	expect().that(calledCapybara).is(false)

	// 	await result2.execute()
	// 	expect().that(calledHyrax).is(true)
	// 	expect().that(calledCapybara).is(true)
	// },

	// async "error handling"() {
	// 	const config = cliConfig({
	// 		name: "example",
	// 		columns,
	// 		commands: {
	// 			icecream: command({
	// 				args: [],
	// 				params: {scoops: param.required(Number)},
	// 			}),
	// 			pizza: command({
	// 				args: [],
	// 				params: {slices: param.required(Number)},
	// 			}),
	// 		},
	// 	})
	// 	expect("invalid number")
	// 		.that(() => cli(argv("icecream --scoops=FAIL"), config))
	// 		.throws()
	// 	expect("missing required param")
	// 		.that(() => cli(argv("icecream"), config))
	// 		.throws()
	// },

})

