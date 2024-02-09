
import {Group} from "../fielding/group.js"
import {Command} from "../commanding/command.js"
import {parsingMachine3} from "./command/machine.js"
import {ParseResult} from "../commanding/parse-result.js"
import {ValuesFromGroup} from "../fielding/values-from-group.js"
import {validateArgOrdering} from "./command/validate-arg-ordering.js"
import {getArgsFollowingCommandTuple} from "./program/get-args-following-command-tuple.js"
import {validateParamAssignmentsAreCompleted} from "./command/validate-param-assignments-are-completed.js"
import {validateRequirements} from "./command/validate-requirements.js"
import {applyDefaults} from "./command/apply-defaults.js"

export function parseCommand<FA extends Group, FP extends Group>(
		tuple: string[],
		command: Command<FA, FP>,
		argv: string[],
	): ParseResult<FA, FP> {

	const [executable, module, ...parts] = argv
	const items = getArgsFollowingCommandTuple(tuple, parts)

	validateArgOrdering(command as Command<any, any>)
	const m = parsingMachine3(command as Command<any, any>)

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

	validateRequirements(command.args, m.args)
	validateRequirements(command.params, m.params)

	applyDefaults(command.args, m.args)
	applyDefaults(command.params, m.params)

	return {
		module,
		executable,
		args: m.args as ValuesFromGroup<FA>,
		params: m.params as ValuesFromGroup<FP>,
	}
}
