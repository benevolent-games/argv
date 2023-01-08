
import {Spec} from "../../types/spec.js"
import {Field} from "../../types/field.js"
import {Values} from "../../types/values.js"
import {parseValue} from "./parse-value.js"

export function parsingMachine<
		FA extends Field.GroupFromValues<Values>,
		FP extends Field.GroupFromValues<Values>
	>(spec: Spec<FA, FP>) {

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

	const args = <Field.ValuesFromGroup<FA>>{}
	const params = <Field.ValuesFromGroup<FP>>{}

	return {
		args,
		params,

		scheduledParamAssignment: () => {
			return <string | undefined>scheduledParamAssignment
		},

		scheduleNextItemAsParamValue: (item: string) => {
			scheduledParamAssignment = item
		},

		saveParamTrue: (item: string) => {
			params[<keyof FP>item] = <any>true
		},

		saveScheduledParam: (item: string) => {
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

		saveShorthandBoolean(item: string) {
			const name = "--" + item.slice(1)
			params[<keyof FP>name] = <any>true
		},
	}
}
