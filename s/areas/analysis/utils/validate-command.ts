
import {Command} from "../types/commands.js"
import {DuplicateArgError, DuplicateFlagError} from "../../../errors/kinds/config.js"

export function validateCommand(command: Command) {
	const args = new Set<string>()
	const flags = new Set<string>()

	// validate arguments
	command.args
		.map(arg => arg.name)
		.forEach(arg => {
			if (args.has(arg)) throw new DuplicateArgError(arg)
			else args.add(arg)
		})

	// validate flags
	Object.values(command.params)
		.filter(param => !!param.flag)
		.forEach(param => {
			const flag = param.flag!
			if (flags.has(flag)) throw new DuplicateFlagError(flag)
			else flags.add(flag)
		})
}

