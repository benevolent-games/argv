
import {Spec} from "./types/spec.js"
import {Command} from "./types/command.js"
import {Argspec} from "./types/argspec.js"
import {Paramspec} from "./types/paramspec.js"
import {parsingStateMachine} from "./internals/machine.js"

export function parse<A extends Argspec, P extends Paramspec>(
		spec: Spec<A, P>
	): Command<A, P> {

	if (spec.argorder.length !== Object.keys(spec.args).length)
		throw new Error("mismatch between 'params' and 'ordering'")

	const [executable, module, ...items] = spec.argv

	const {
		args,
		params,
		isScheduledAsParamValue,
		saveArg,
		saveParam,
		scheduleNextItemAsParamValue,
	} = parsingStateMachine(spec)

	for (const item of items) {

		if (isScheduledAsParamValue())
			saveParam(item)

		else {
			if (item.startsWith("--"))
				scheduleNextItemAsParamValue(item)
			else
				saveArg(item)
		}
	}

	return {executable, module, args, params}
}
