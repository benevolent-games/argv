
import {Spec5} from "./types/spec.js"
import {ZField} from "./types/field.js"
import {Values} from "./types/values.js"
import {ZResult} from "./types/result.js"
import {parsingMachine} from "./internals/machine.js"

export function parse4<A extends Values, P extends Values>() {
	return function<FA extends ZField.Group<A>, FP extends ZField.Group<P>>(
			spec: Spec5<FA, FP>
		): ZResult<FA, FP> {

		if (spec.argorder.length !== Object.keys(spec.args).length)
			throw new Error("mismatch between 'params' and 'ordering'")

		const [executable, module, ...items] = spec.argv

		const {
			args,
			params,
			saveArg,
			saveParam,
			saveEqualSignedParam,
			saveEnabledBooleanParam,
			isScheduledAsParamValue,
			scheduleNextItemAsParamValue,
		} = parsingMachine(spec)

		for (const item of items) {
			if (isScheduledAsParamValue())
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

		return {spec, executable, module, args, params}
	}
}
