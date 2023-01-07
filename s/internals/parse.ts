
import {Spec5} from "../types/spec.js"
import {ZField} from "../types/field.js"
import {PResult} from "../types/result.js"
import {parsingMachine} from "./parsing/machine.js"
import {validateArgOrdering} from "./parsing/validate-arg-ordering.js"
import {validateParamAssignmentsAreCompleted} from "./parsing/validate-param-assignments-are-completed.js"

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
