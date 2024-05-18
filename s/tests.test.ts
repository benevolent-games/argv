
import cli from "./cli/cli.test.js"
import parse from "./parsing/parse.test.js"
import analyze from "./analysis/analyze.test.js"
import {runTests} from "./testing/framework/run-tests.js"

await runTests({
	cli,
	parse,
	analyze,
})

