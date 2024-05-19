
import {TestSuite} from "./test-suite.js"
import {color} from "../../tooling/colors.js"
import {TestFailure} from "./errors/test-failure.js"

export async function runTests(suites: Record<string, TestSuite>) {
	const failures: [string, string, Error][] = []

	for (const [suiteLabel, suite] of Object.entries(suites)) {
		const testEntries = Object.entries(suite)
		await Promise.all(
			testEntries.map(
				async([label, test]) => test().catch(err => {
					if (err instanceof Error)
						failures.push([suiteLabel, label, err])
					else {
						console.error(color.red("UNKNOWN ERROR!!"))
						console.error(err)
						process.exit(1)
					}
				})
			)
		)
	}

	const nfail = failures.length
	const failed = nfail > 0
	const failure_s = nfail === 1 ?"failure" :"failures"

	if (failed) {
		for (const [suiteLabel, testLabel, error] of failures) {

			console.error([
				color.magenta(error.name),
				color.yellow(`${suiteLabel} "${testLabel}"`),
				color.red("fails"),
				color.magenta(error.message),
			].join(" "))

			console.error("")

			// if (!(error instanceof TestFailure) && error.stack) {
			// 	console.error(
			// 		color.green(
			// 			error
			// 				.stack
			// 				.split("\n")
			// 				.slice(1)
			// 				.join("\n")
			// 		)
			// 	)
			// }
		}

		console.error(color.red(`${nfail} ${failure_s}.`))
		process.exit(1)
	}
	else {
		console.log(color.green(`${nfail} ${failure_s}.`))
		process.exit(0)
	}
}
