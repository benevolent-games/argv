
// import {analyze} from "./analyze.js"
// import {argv} from "../testing/argv.js"
// import {expect} from "../testing/framework/expect.js"
// import {arg, args, command, params} from "./helpers.js"
import {testSuite} from "../testing/framework/test-suite.js"

export default testSuite({

	// //
	// // basics
	// //

	// async "no inputs, no problem"() {
	// 	analyze({argv: argv(), commands: command("", args(), params({}))})
	// 	analyze({argv: argv("extra"), commands: command("", args(), params({}))})
	// },

	// //
	// // args
	// //

	// async "arg.required"() {
	// 	expect("we can read the arg")
	// 		.that(
	// 			analyze({
	// 				argv: argv("pepperoni"),
	// 				commands: command("",
	// 					args(arg.required("topping", String, "")),
	// 					params({}),
	// 				),
	// 			})
	// 			.tree.args.topping
	// 		)
	// 		.is("pepperoni")
	// 	expect("error is thrown when requirement is not met")
	// 		.that(() =>
	// 			analyze({
	// 				argv: argv(),
	// 				commands: command("",
	// 					args(arg.required("topping", String, "")),
	// 					params({}),
	// 				),
	// 			})
	// 		)
	// 		.throws()
	// },

	// async "arg.optional"() {
	// 	void 0
	// },

	// async "arg.default"() {
	// 	void 0
	// },

	// //
	// // params
	// //

	// async "param.required"() {
	// 	void 0
	// },

	// async "param.optional"() {
	// 	void 0
	// },

	// async "param.default"() {
	// 	void 0
	// },
})

