
import {cli} from "../../cli.js"

type Args = {
	environment: string
	suite: string
}

type Params = {
	"--help": boolean,
	"--label": string,
	"--host": string,
	"--port": number,
	"--verbose": boolean,
}

const {args, params} = cli<Args, Params>()({
	program: "cynic",
	argv: process.argv,
	columns: process.stdout.columns,

	readme: "https://github.com/@benev/argv",
	help: "run a cynic test suite module",

	argorder: ["environment", "suite"],

	args: {
		environment: {
			type: String,
			mode: "requirement",
			help: "runtime to run the tests (can be 'node', 'browser', or 'puppeteer')",
		},
		suite: {
			type: String,
			mode: "default",
			default: "dist/suite.test.js",
			help: "path to the test suite module (eg, 'dist/suite.test.js')",
		},
	},

	params: {
		"--help": {
			type: Boolean,
			mode: "option",
			help: "trigger the help prompt"
		},
		"--label": {
			type: String,
			mode: "requirement",
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

console.log({args, params})
