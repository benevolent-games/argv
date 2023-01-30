
import {Command} from "../program.js"
import {parsingMachine2} from "./parsing/machine.js"
import {validateArgOrdering2} from "./parsing/validate-arg-ordering.js"
import {validateParamAssignmentsAreCompleted} from "./parsing/validate-param-assignments-are-completed.js"

export function parse2(command: Command, items: string[]) {

	validateArgOrdering2(command)

	const {
		args,
		params,
		saveArg,
		saveParamTrue,
		saveScheduledParam,
		saveEqualSignedParam,
		saveShorthandBoolean,
		scheduledParamAssignment,
		scheduleNextItemAsParamValue,
	} = parsingMachine2(command)

	for (const item of items) {
		if (scheduledParamAssignment())
			saveScheduledParam(item)
		else {
			if (item.startsWith("--"))
				if (item.includes("="))
					saveEqualSignedParam(item)
				else
					if (item === "--help")
						saveParamTrue(item)
					else
						scheduleNextItemAsParamValue(item)
			else if (item.startsWith("+"))
				saveShorthandBoolean(item)
			else
				saveArg(item)
		}
	}

	validateParamAssignmentsAreCompleted(scheduledParamAssignment())

	return {args, params}
}
