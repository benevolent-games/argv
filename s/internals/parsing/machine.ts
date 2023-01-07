
import {Spec5} from "../../types/spec.js"
import {ZField} from "../../types/field.js"
import {Values} from "../../types/values.js"
import {parseValue} from "./parse-value.js"

export function parsingMachine<
		FA extends ZField.GroupFromValues<Values>,
		FP extends ZField.GroupFromValues<Values>
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

	const args = <ZField.ValuesFromGroup<FA>>{}
	const params = <ZField.ValuesFromGroup<FP>>{}

	return {
		args,
		params,

		scheduledParamAssignment: () => {
			return <string | undefined>scheduledParamAssignment
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
			const name = "--" + item.slice(1)
			params[<keyof FP>name] = <any>true
		},
	}
}
