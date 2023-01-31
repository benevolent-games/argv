
import {Field} from "../types/field.js"
import {CommandSpec} from "../program2.js"
import {Command, getArgsFollowingCommandTuple} from "../program.js"
import {parsingMachine2, parsingMachine3} from "./parsing/machine.js"
import {validateArgOrdering2, validateArgOrdering3} from "./parsing/validate-arg-ordering.js"
import {validateParamAssignmentsAreCompleted} from "./parsing/validate-param-assignments-are-completed.js"

export function parse3<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group
	>(
		spec: CommandSpec<FA, FP>,
		cmd: string,
		argv: string[],
	) {

	const [executable, module, ...parts] = argv
	const tuple = cmd.toLowerCase().split(" ")
	const items = getArgsFollowingCommandTuple(tuple, parts)

	validateArgOrdering3(spec as CommandSpec)

	const {
		args,
		params,
		saveArg,
		saveParamTrue,
		saveScheduledParam,
		saveEqualSignedParam,
		saveShorthandBoolean,
		scheduledParamAssignment,
		scheduleNextItemAsParamValue,
	} = parsingMachine3(spec as CommandSpec)

	for (const item of items) {
		if (scheduledParamAssignment())
			saveScheduledParam(item)
		else {
			if (item.startsWith("--"))
				if (item.includes("="))
					saveEqualSignedParam(item)
				else
					if (item === "--help")
						saveParamTrue(item)
					else
						scheduleNextItemAsParamValue(item)
			else if (item.startsWith("+"))
				saveShorthandBoolean(item)
			else
				saveArg(item)
		}
	}

	validateParamAssignmentsAreCompleted(scheduledParamAssignment())

	return {
		args: args as Field.ValuesFromGroup<FA>,
		params: params as Field.ValuesFromGroup<FP>,
		executable,
		module,
	}
}

export function parse2(command: Command, items: string[]) {

	validateArgOrdering2(command)

	const {
		args,
		params,
		saveArg,
		saveParamTrue,
		saveScheduledParam,
		saveEqualSignedParam,
		saveShorthandBoolean,
		scheduledParamAssignment,
		scheduleNextItemAsParamValue,
	} = parsingMachine2(command)

	for (const item of items) {
		if (scheduledParamAssignment())
			saveScheduledParam(item)
		else {
			if (item.startsWith("--"))
				if (item.includes("="))
					saveEqualSignedParam(item)
				else
					if (item === "--help")
						saveParamTrue(item)
					else
						scheduleNextItemAsParamValue(item)
			else if (item.startsWith("+"))
				saveShorthandBoolean(item)
			else
				saveArg(item)
		}
	}

	validateParamAssignmentsAreCompleted(scheduledParamAssignment())

	return {args, params}
}
