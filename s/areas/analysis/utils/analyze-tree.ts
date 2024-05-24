
import {Command, CommandTree} from "../types/commands.js"
import {CommandAnalysis, TreeAnalysis} from "../types/analysis.js"

export function produceTreeAnalysis<C extends CommandTree>(
		commands: C,
		command: Command,
		commandAnalysis: CommandAnalysis<Command>,
	): TreeAnalysis<C> {

	function recurse(c: CommandTree, path: string[]): any {
		if (c instanceof Command)
			return (c === command)
				? commandAnalysis
				: undefined
		else
			return Object.fromEntries(
				Object.entries(c)
					.map(([key, c2]) => [key, recurse(c2, [...path, key])])
			)
	}

	return recurse(commands, [])
}

