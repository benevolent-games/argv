
// import {cli} from "./cli/cli.js"
// import {analyze} from "./analysis/analyze.js"
// import {arg, args, command, param, params} from "./analysis/helpers.js"

// //
// // cli
// //

// const argv = cli({
// 	name: "icecream",
// 	argv: process.argv,
// 	commands: command(
// 		`make incredible iced cream.`,
// 		args(
// 			arg.required("vessel", String, `"cone" or "waffle-cone".`),
// 		),
// 		params({
// 			scoops: param.required(Number, `how many scoops?`),
// 			flavor: param.default(String, "vanilla", `what flavor?`),
// 			sprinkles: param.flag("s", `do you want sprinkles?`),
// 		}),
// 	),
// })

// argv.args.vessel
// argv.params.scoops
// argv.params.flavor
// argv.params.sprinkles

// //
// // cli
// //

// const result = analyze({
// 	argv: process.argv,
// 	commands: {
// 		lol: command("", args(arg.required("hah", String, `hah`)), params({})),
// 		rofl: command("", args(arg.optional("heh", String, `heh`)), params({
// 			kek: param.flag("-k", "kekekekek"),
// 		})),
// 	},
// })

// result.tree.lol!.args.hah
// result.tree.rofl!.args.heh
// result.tree.rofl!.params.kek

