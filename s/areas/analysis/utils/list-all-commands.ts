
import {Command, CommandTree} from "../types/commands.js"

export type Cmd = {command: Command, path: string[]}

export function listAllCommands(commands: CommandTree) {
	const list: Cmd[] = []
	function recurse(c: CommandTree, path: string[]): any {
		if (c instanceof Command)
			list.push({path, command: c})
		else for (const [key, c2] of Object.entries(c))
			recurse(c2, [...path, key])
	}
	recurse(commands, [])
	return list
}

