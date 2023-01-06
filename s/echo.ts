
import {parse} from "./parse.js"

const {executable, module, args, params} = parse({
	argv: process.argv,
	argorder: ["environment", "suite"],
	args: {
		environment: String,
		suite: String,
	},
	params: {
		"--label": String,
		"--port": Number,
		"--importmap": String,
		"--verbose": Boolean,
	},
})

console.log("executable", executable)
console.log("module", module)
console.log("args", args)
console.log("params", params)
