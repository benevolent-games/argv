
import {Command, CommandTree} from "../types/commands.js"

export function listAllCommands(commands: CommandTree) {
	const commandlist: {path: string[], command: Command}[] = []
	function recurse(c: CommandTree, path: string[]): any {
		if (c instanceof Command)
			commandlist.push({path, command: c})
		else
			for (const [key, c2] of Object.entries(c))
				recurse(c2, [...path, key])
	}
	recurse(commands, [])
	return commandlist
}

