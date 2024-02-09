
import {undash} from "./undash.js"
import {parseValue} from "./parse-value.js"
import {Group} from "../../fielding/group.js"
import {Values} from "../../fielding/values.js"
import {Command} from "../../commanding/command.js"
import {ValuesFromGroup} from "../../fielding/values-from-group.js"

export function parsingMachine3(command: Command<any, any>) {
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

	const args = {} as Values
	const params = {} as Values

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

export function parsingMachine2(command: Command<any, any>) {

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
		FA extends Group,
		FP extends Group,
	>(command: Command<FA, FP>) {

	let paramIndex = 0
	let scheduledParamAssignment: undefined | keyof FP = undefined

	function getArgType(name: keyof FA) {
		return name in command.args
			? command.args[name]["type"]
			: String
	}

	function getParamType(name: keyof FP) {
		return name in command.params
			? command.params[name]["type"]
			: String
	}

	const args = <ValuesFromGroup<FA>>{}
	const params = <ValuesFromGroup<FP>>{}

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
			const name = command.argorder[index]!
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
