
import {Spec} from "./types/spec.js"
import {Field} from "./types/field.js"
import {Values} from "./types/values.js"
import {Command} from "./types/command.js"
import {parse} from "./internals/parse.js"
import {helper} from "./internals/helper.js"
import {errorReport} from "./internals/error-report.js"
import {validateRequirements} from "./internals/parsing/validate-requirements.js"
import {applyDefaults} from "./internals/parsing/apply-defaults.js"

export function cli<A extends Values, P extends Values>() {
	return function<
			FA extends Field.GroupFromValues<A>,
			FP extends Field.GroupFromValues<P>
		>(spec: Spec<FA, FP>): Command<FA, FP> {

		try {
			const command = parse(spec)

			if ("--help" in command.params && command.params["--help"]) {
				for (const report of helper(command))
					console.log(report)

				process.exit(0)
			}

			validateRequirements(command.spec.args, command.args)
			validateRequirements(command.spec.params, command.params)

			applyDefaults(command.spec.args, command.args)
			applyDefaults(command.spec.params, command.params)

			return command
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
