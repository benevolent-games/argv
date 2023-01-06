
import {Spec5} from "../types/spec.js"
import {ZField} from "../types/field.js"
import {Values} from "../types/values.js"
import {parseValue} from "./parse-value.js"
import {ZFieldsToResults} from "../types/fields-to-results.js"

export function parsingMachine<
		FA extends ZField.Group<Values>,
		FP extends ZField.Group<Values>
	>(spec: Spec5<FA, FP>) {

	let paramIndex = 0
	let scheduledParamAssignment: undefined | keyof FP = undefined

	function getArgType(name: keyof FA) {
		return name in spec.args
			? spec.args[name]["type"]
			: String
	}

	function getParamType(name: keyof FP) {
		return name in spec.params
			? spec.params[name]["type"]
			: String
	}

	const args = <ZFieldsToResults<FA>>{}
	const params = <ZFieldsToResults<FP>>{}

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
			params[name] = <any>parseValue(getParamType(name), item)
		},

		saveArg: (item: string) => {
			const index = paramIndex++
			const name = spec.argorder[index]!
			args[name] = <any>parseValue(getArgType(name), item)
		},

		saveEqualSignedParam(item: string) {
			const [name, value] = item.split("=")
			params[<keyof FP>name] = <any>parseValue(getParamType(name), value)
		},

		saveEnabledBooleanParam(item: string) {
			const name = item.slice(1)
			params[<keyof FP>name] = <any>true
		},
	}
}
