
import {helper} from "./help.js"
import {parse4} from "./parse2.js"
import {ZField} from "./types/field.js"
import {Spec5} from "./types/spec.js"
import {Type} from "./types/type.js"

type Args = {
	environment: string
	suite: string
}

type Params = {
	"--help": string,
	"--label": string,
	"--host": string,
	"--port": number,
	"--verbose": boolean,
}

const {args, params, spec} = parse4<Args, Params>()({
	argv: process.argv,
	columns: process.stdout.columns ?? 72,

	bin: "cynic",
	argorder: ["environment", "suite"],
	readme: "https://github.com/@benev/argv",
	help: "run a cynic test suite module",
	
	args: {
		environment: {
			type: String,
			mode: "requirement",
			help: "runtime to run the tests (can be 'node', 'browser', or 'puppeteer')",
		},
		suite: {
			type: String,
			mode: "requirement",
			help: "path to the test suite module (eg, 'dist/suite.test.js')",
		},
	},

	params: {
		"--help": {
			type: String,
			mode: "option",
			help: "trigger the help prompt"
		},
		"--label": {
			type: String,
			mode: "option",
			help: "title string displayed in the suite report",
		},
		"--host": {
			type: String,
			mode: "default",
			default: "http://localhost",
			help: "url hostname, to connect to the http server (for browser or puppeteer)",
		},
		"--port": {
			type: Number,
			mode: "default",
			default: 8021,
			help: "port the http server should use",
		},
		"--verbose": {
			type: Boolean,
			mode: "option",
			help: "show more data",
		},
	},
})

// console.log("args", args)
// console.log("params", params)

if ("--help" in params)
	for (const report of helper({spec, args, params}))
		console.log(report)
