
import {parse4} from "./parse2.js"

type Args = {
	environment: string
	suite: string
}

type Params = {
	"--label": string,
	"--host": string,
	"--port": number,
}

const {args, params} = parse4<Args, Params>()({
	readme: "https://github.com/@benev/argv",
	argv: process.argv,
	argorder: ["environment", "suite"],
	args: {
		environment: {
			type: String,
			mode: "required",
			help: "runtime to run the tests (can be 'node', 'browser', or 'puppeteer')",
		},
		suite: {
			type: String,
			mode: "required",
			help: "path to the test suite module (eg, 'dist/suite.test.js')",
		},
	},
	params: {
		"--label": {
			type: String,
			mode: "optional",
			help: "title string displayed in the suite report",
		},
		"--host": {
			type: String,
			mode: "defaulting",
			default: "http://localhost",
			help: "url hostname, to connect to the http server (for browser or puppeteer)",
		},
		"--port": {
			type: Number,
			mode: "defaulting",
			default: 8021,
			help: "port the http server should use",
		},
		"--verbose": {
			type: Boolean,
			mode: "optional",
			help: "show more data",
		},
	},
})

console.log("args", args)
console.log("params", params)
