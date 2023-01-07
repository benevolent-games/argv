
import {Spec5} from "./types/spec.js"
import {color} from "./tools/colors.js"
import {ZField} from "./types/field.js"
import {Values} from "./types/values.js"
import {PResult} from "./types/result.js"
import {helper} from "./internals/help/helper.js"
import {ArgvError} from "./errors/argv-error.js"
import {parsingMachine} from "./internals/machine.js"
import {validateArgOrdering} from "./internals/validate-arg-ordering.js"
import {validateParamAssignmentsAreCompleted} from "./internals/validate-param-assignments-are-completed.js"

export function parse<
		FA extends ZField.Group,
		FP extends ZField.Group
	>(spec: Spec5<FA, FP>): PResult<FA, FP> {

	validateArgOrdering(spec)
	const [executable, module, ...items] = spec.argv

	const {
		args,
		params,
		saveArg,
		saveParam,
		saveEqualSignedParam,
		saveEnabledBooleanParam,
		scheduledParamAssignment,
		scheduleNextItemAsParamValue,
	} = parsingMachine(spec)

	for (const item of items) {
		if (scheduledParamAssignment())
			saveParam(item)
		else {
			if (item.startsWith("--"))
				if (item.includes("="))
					saveEqualSignedParam(item)
				else
					scheduleNextItemAsParamValue(item)
			else if (item.startsWith("+"))
				saveEnabledBooleanParam(item)
			else
				saveArg(item)
		}
	}

	validateParamAssignmentsAreCompleted(scheduledParamAssignment())
	return {spec, args, params, executable, module}
}

export function cli<A extends Values, P extends Values>() {
	return function<
			FA extends ZField.GroupFromValues<A>,
			FP extends ZField.GroupFromValues<P>
		>(spec: Spec5<FA, FP>): PResult<FA, FP> {

		try {
			const result = parse(spec)

			if ("--help" in result.params) {
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

export function errorReport(err: any) {
	const flag = color.red("ERR!!")

	return (
		(err instanceof Error)

			? (err instanceof ArgvError)
				? [
					flag + " " +
					color.yellow(err.name) + " " +
					color.green(err.message)
				]
				: [
					flag + " " +
					color.yellow(err.name) + " " +
					color.green(err.message) + "\n" +
					color.red(
						(err
							.stack
							?.split("\n")
							.slice(1)
							.map(s => s.trim())
							.join("\n")
						) ?? ""
					)
				]

			: [flag + " ", err]
	)
}
