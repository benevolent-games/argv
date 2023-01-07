
import {Spec} from "./types/spec.js"
import {Field} from "./types/field.js"
import {Values} from "./types/values.js"
import {Command} from "./types/command.js"
import {parse} from "./internals/parse.js"
import {helper} from "./internals/helper.js"
import {errorReport} from "./internals/error-report.js"

export function cli<A extends Values, P extends Values>() {
	return function<
			FA extends Field.GroupFromValues<A>,
			FP extends Field.GroupFromValues<P>
		>(spec: Spec<FA, FP>): Command<FA, FP> {

		try {
			const result = parse(spec)

			if ("--help" in result.params && result.params["--help"]) {
				for (const report of helper(result))
					console.log(report)

				process.exit(0)
			}

			return result
		}
		catch (err: any) {
			const errortext = errorReport(err)
			const printError = () => console.error(...errortext)
			printError()
			console.error("")

			for (const report of helper({spec}))
				console.error(report)

			console.error("")
			printError()
			process.exit(1)
		}
	}
}
