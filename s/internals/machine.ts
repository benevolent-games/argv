
import {Spec} from "../types/spec.js"
import {Argspec} from "../types/argspec.js"
import {Command} from "../types/command.js"
import {parseValue} from "./parse-value.js"
import {Paramspec} from "../types/paramspec.js"

export function parsingMachine<A extends Argspec, P extends Paramspec>(
		spec: Spec<A, P>
	) {

	let paramIndex = 0
	let scheduledParamAssignment: undefined | keyof P = undefined

	const getArgType = (name: keyof A) => spec.args[name]
	const getParamType = (name: keyof P) => spec.params[name]

	const args: Command<A, P>["args"] = {}
	const params: Command<A, P>["params"] = {}

	return {
		args,
		params,

		isScheduledAsParamValue: () => {
			return !!scheduledParamAssignment
		},

		scheduleNextItemAsParamValue: (item: string) => {
			scheduledParamAssignment = item
		},

		saveParam: (item: string) => {
			const name = scheduledParamAssignment!
			scheduledParamAssignment = undefined
			params[name] = parseValue(getParamType(name), item)
		},

		saveArg: (item: string) => {
			const index = paramIndex++
			const name = spec.argorder[index]!
			args[name] = parseValue(getArgType(name), item)
		},
	}
}
