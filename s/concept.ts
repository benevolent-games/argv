
import {help} from "./help.js"
import {parse4} from "./parse2.js"

type Args = {
	environment: string
	suite: string
}

type Params = {
	"--label": string,
	"--host": string,
	"--port": number,
	"--verbose": boolean,
}

const {args, params, spec} = parse4<Args, Params>()({
	bin: "cynic",
	argv: process.argv,
	readme: "https://github.com/@benev/argv",
	columns: process.stdout.columns ?? 72,
	argorder: ["environment", "suite"],
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

console.log("args", args)
console.log("params", params)
console.log("")

if (help({spec, params}))
	process.exit(0)
