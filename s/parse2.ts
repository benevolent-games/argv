
import {Spec5} from "./types/spec.js"
import {ZField} from "./types/field.js"
import {Values} from "./types/values.js"
import {ZResult} from "./types/result.js"
import {parsingMachine} from "./internals/machine.js"
import {validateArgOrdering} from "./internals/validate-arg-ordering.js"
import {validateParamAssignmentsAreCompleted} from "./internals/validate-param-assignments-are-completed.js"

export function parse4<A extends Values, P extends Values>() {
	return function<FA extends ZField.Group<A>, FP extends ZField.Group<P>>(
			spec: Spec5<FA, FP>
		): ZResult<FA, FP> {

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

		return {spec, executable, module, args, params}
	}
}
