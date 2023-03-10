
import {color} from "../../../tools/colors.js"

export async function runTests<
		T extends {[key: string]: () => Promise<void>}
	>(tests: T) {

	const testEntries = [...Object.entries(tests)]
	const failures: [string, Error][] = []

	await Promise.all(
		testEntries.map(
			async([label, test]) => test().catch(err => {
				if (err instanceof Error)
					failures.push([label, err])
				else {
					console.error(color.red("UNKNOWN ERROR!!"))
					console.error(err)
					process.exit(1)
				}
			})
		)
	)

	const nfail = failures.length
	const failed = nfail > 0
	const failure_s = nfail === 1 ?"failure" :"failures"

	if (failed) {
		for (const [testLabel, error] of failures) {
			console.error([
				color.magenta(error.name),
				color.yellow(testLabel),
				color.red("fails"),
				color.magenta(error.message),
			].join(" "))
		}
		console.error(color.red(`${nfail} ${failure_s}.`))
		process.exit(1)
	}
	else {
		console.log(color.green(`${nfail} ${failure_s}.`))
		process.exit(0)
	}
}
