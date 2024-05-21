
import {Command} from "../types/commands.js"
import {Param, ParamFlag} from "../types/params.js"
import {DuplicateArgError, DuplicateFlagError} from "../../../errors/kinds/config.js"

export function validateCommand(command: Command) {
	const args = new Set<string>()
	const flags = new Set<string>()

	// validate arguments
	command.args
		.map(a => a.name)
		.forEach(arg => {
			if (args.has(arg)) throw new DuplicateArgError(arg)
			else args.add(arg)
		})

	// validate flags
	Object.values(command.params)
		.filter(isFlag)
		.map(p => p.flag)
		.forEach(flag => {
			if (flags.has(flag)) throw new DuplicateFlagError(flag)
			else flags.add(flag)
		})
}

//////////////////////////

function isFlag(param: Param): param is ParamFlag {
	return param.mode === "flag"
}

