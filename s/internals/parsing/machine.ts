
import {undash} from "./undash.js"
import {Spec} from "../../types/spec.js"
import {Command} from "../../program.js"
import {Field} from "../../types/field.js"
import {parseValue} from "./parse-value.js"
import {Values} from "../../types/values.js"
import {CommandSpec} from "../../program2.js"

export function parsingMachine3(command: CommandSpec) {
	let paramIndex = 0
	let scheduledParamAssignment: undefined | string = undefined

	function getArgType(name: string) {
		return name in command.args
			? command.args[name]["type"]
			: String
	}

	function getParamType(name: string) {
		return name in command.params
			? command.params[name]["type"]
			: String
	}

	const args = <Values>{}
	const params = <Values>{}

	return {
		args,
		params,

		scheduledParamAssignment: () => {
			return <string | undefined>scheduledParamAssignment
		},

		scheduleNextItemAsParamValue: (item: string) => {
			scheduledParamAssignment = undash(item)
		},

		saveParamTrue: (item: string) => {
			params[undash(item)] = <any>true
		},

		saveScheduledParam: (item: string) => {
			const name = scheduledParamAssignment!
			scheduledParamAssignment = undefined
			params[name] = <any>parseValue(getParamType(name), item)
		},

		saveArg: (item: string) => {
			const index = paramIndex++
			const name = command.argorder[index]! as string
			args[name] = <any>parseValue(getArgType(name), item)
		},

		saveEqualSignedParam(item: string) {
			const [name, value] = undash(item).split("=")
			params[name] = <any>parseValue(getParamType(name), value)
		},

		saveShorthandBoolean(item: string) {
			const name = item.slice(1)
			params[name] = <any>true
		},
	}
}

export function parsingMachine2(command: Command) {

	let paramIndex = 0
	let scheduledParamAssignment: undefined | string = undefined

	function getArgType(name: string) {
		return name in command.args
			? command.args[name]["type"]
			: String
	}

	function getParamType(name: string) {
		return name in command.params
			? command.params[name]["type"]
			: String
	}

	const args = <Values>{}
	const params = <Values>{}

	return {
		args,
		params,

		scheduledParamAssignment: () => {
			return <string | undefined>scheduledParamAssignment
		},

		scheduleNextItemAsParamValue: (item: string) => {
			scheduledParamAssignment = undash(item)
		},

		saveParamTrue: (item: string) => {
			params[undash(item)] = <any>true
		},

		saveScheduledParam: (item: string) => {
			const name = scheduledParamAssignment!
			scheduledParamAssignment = undefined
			params[name] = <any>parseValue(getParamType(name), item)
		},

		saveArg: (item: string) => {
			const index = paramIndex++
			const name = command.argorder[index]! as string
			args[name] = <any>parseValue(getArgType(name), item)
		},

		saveEqualSignedParam(item: string) {
			const [name, value] = undash(item).split("=")
			params[name] = <any>parseValue(getParamType(name), value)
		},

		saveShorthandBoolean(item: string) {
			const name = item.slice(1)
			params[name] = <any>true
		},
	}
}

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
			scheduledParamAssignment = undash(item)
		},

		saveParamTrue: (item: string) => {
			params[<keyof FP>undash(item)] = <any>true
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
			const [name, value] = undash(item).split("=")
			params[<keyof FP>name] = <any>parseValue(getParamType(name), value)
		},

		saveShorthandBoolean(item: string) {
			const name = item.slice(1)
			params[<keyof FP>name] = <any>true
		},
	}
}
