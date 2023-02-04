
// import {Field} from "../types/field.js"
// import {CommandSpec2, ParseResult} from "../program2.js"
// import {Command, getArgsFollowingCommandTuple} from "../program.js"
// import {parsingMachine2, parsingMachine3} from "./parsing/machine.js"
// import {validateArgOrdering2, validateArgOrdering3} from "./parsing/validate-arg-ordering.js"
// import {validateParamAssignmentsAreCompleted} from "./parsing/validate-param-assignments-are-completed.js"

// export function parse4(
// 		spec: CommandSpec2,
// 		argv: string[],
// 	): ParseResult {

// 	const [executable, module, ...parts] = argv
// 	const tuple = spec.cmd.toLowerCase().split(" ")
// 	const items = getArgsFollowingCommandTuple(tuple, parts)

// 	validateArgOrdering3(spec as CommandSpec2)
// 	const m = parsingMachine3(spec as CommandSpec2)

// 	for (const item of items) {
// 		if (m.scheduledParamAssignment())
// 			m.saveScheduledParam(item)
// 		else {
// 			if (item.startsWith("--"))
// 				if (item.includes("="))
// 					m.saveEqualSignedParam(item)
// 				else
// 					if (item === "--help")
// 						m.saveParamTrue(item)
// 					else
// 						m.scheduleNextItemAsParamValue(item)
// 			else if (item.startsWith("+"))
// 				m.saveShorthandBoolean(item)
// 			else
// 				m.saveArg(item)
// 		}
// 	}

// 	validateParamAssignmentsAreCompleted(m.scheduledParamAssignment())

// 	return {
// 		module,
// 		executable,
// 		cmd: spec.cmd,
// 		args: m.args as Field.ValuesFromGroup<FA>,
// 		params: m.params as Field.ValuesFromGroup<FP>,
// 	}
// }

// export function parse3<
// 		FA extends Field.Group = Field.Group,
// 		FP extends Field.Group = Field.Group
// 	>(
// 		spec: CommandSpec<FA, FP>,
// 		cmd: string,
// 		argv: string[],
// 	): ParseResult<FA, FP> {

// 	const [executable, module, ...parts] = argv
// 	const tuple = cmd.toLowerCase().split(" ")
// 	const items = getArgsFollowingCommandTuple(tuple, parts)

// 	validateArgOrdering3(spec as CommandSpec)

// 	const {
// 		args,
// 		params,
// 		saveArg,
// 		saveParamTrue,
// 		saveScheduledParam,
// 		saveEqualSignedParam,
// 		saveShorthandBoolean,
// 		scheduledParamAssignment,
// 		scheduleNextItemAsParamValue,
// 	} = parsingMachine3(spec as CommandSpec)

// 	for (const item of items) {
// 		if (scheduledParamAssignment())
// 			saveScheduledParam(item)
// 		else {
// 			if (item.startsWith("--"))
// 				if (item.includes("="))
// 					saveEqualSignedParam(item)
// 				else
// 					if (item === "--help")
// 						saveParamTrue(item)
// 					else
// 						scheduleNextItemAsParamValue(item)
// 			else if (item.startsWith("+"))
// 				saveShorthandBoolean(item)
// 			else
// 				saveArg(item)
// 		}
// 	}

// 	validateParamAssignmentsAreCompleted(scheduledParamAssignment())

// 	return {
// 		cmd,
// 		args: args as Field.ValuesFromGroup<FA>,
// 		params: params as Field.ValuesFromGroup<FP>,
// 		executable,
// 		module,
// 	}
// }

// export function parse2(command: Command, items: string[]) {

// 	validateArgOrdering2(command)

// 	const {
// 		args,
// 		params,
// 		saveArg,
// 		saveParamTrue,
// 		saveScheduledParam,
// 		saveEqualSignedParam,
// 		saveShorthandBoolean,
// 		scheduledParamAssignment,
// 		scheduleNextItemAsParamValue,
// 	} = parsingMachine2(command)

// 	for (const item of items) {
// 		if (scheduledParamAssignment())
// 			saveScheduledParam(item)
// 		else {
// 			if (item.startsWith("--"))
// 				if (item.includes("="))
// 					saveEqualSignedParam(item)
// 				else
// 					if (item === "--help")
// 						saveParamTrue(item)
// 					else
// 						scheduleNextItemAsParamValue(item)
// 			else if (item.startsWith("+"))
// 				saveShorthandBoolean(item)
// 			else
// 				saveArg(item)
// 		}
// 	}

// 	validateParamAssignmentsAreCompleted(scheduledParamAssignment())

// 	return {args, params}
// }
