
import cli from "./areas/cli/cli.test.js"
import parse from "./areas/parsing/parse.test.js"
import analyze from "./areas/analysis/analyze.test.js"
import {runTests} from "./testing/framework/run-tests.js"

await runTests({
	cli,
	parse,
	analyze,
})

