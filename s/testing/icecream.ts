
// import {program} from "../../program.js"
// import {ConsoleLogger} from "../tooling/logger.js"

// const result = await program({
// 	argv: process.argv,
// 	exit: code => process.exit(code),
// 	name: "icecream",
// 	logger: new ConsoleLogger(),
// 	columns: process.stdout.columns ?? 72,
// 	commands: command => ({
// 		buy: command({
// 			argorder: ["vessel"],
// 			args: {
// 				vessel: {
// 					type: String,
// 					mode: "option",
// 					help: "hello",
// 				},
// 			},
// 			params: {
// 				scoops: {
// 					mode: "requirement",
// 					type: Number,
// 					help: `how many scoops you'd like`,
// 				},
// 			},
// 			execute: async(parse) => {
// 				console.log("execute", parse)
// 			},
// 		}),
// 	}),
// })

// console.log("result", result)

