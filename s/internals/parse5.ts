
import {Field} from "../types/field.js"
import {parsingMachine3} from "./parsing/machine.js"
import {validateArgOrdering3} from "./parsing/validate-arg-ordering.js"
import {CommandSpec2, getArgsFollowingCommandTuple, ParseResult} from "../program2.js"
import {validateParamAssignmentsAreCompleted} from "./parsing/validate-param-assignments-are-completed.js"

export function parse5<FA extends Field.Group, FP extends Field.Group>(
		tuple: string[],
		command: CommandSpec2<FA, FP>,
		argv: string[],
	): ParseResult<FA, FP> {

	const [executable, module, ...parts] = argv
	const items = getArgsFollowingCommandTuple(tuple, parts)

	validateArgOrdering3(command as CommandSpec2)
	const m = parsingMachine3(command as CommandSpec2)

	for (const item of items) {
		if (m.scheduledParamAssignment())
			m.saveScheduledParam(item)
		else {
			if (item.startsWith("--"))
				if (item.includes("="))
					m.saveEqualSignedParam(item)
				else
					if (item === "--help")
						m.saveParamTrue(item)
					else
						m.scheduleNextItemAsParamValue(item)
			else if (item.startsWith("+"))
				m.saveShorthandBoolean(item)
			else
				m.saveArg(item)
		}
	}

	validateParamAssignmentsAreCompleted(m.scheduledParamAssignment())

	return {
		module,
		executable,
		args: m.args as Field.ValuesFromGroup<FA>,
		params: m.params as Field.ValuesFromGroup<FP>,
	}
}
