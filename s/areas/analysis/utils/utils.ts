
import {parse} from "../../parsing/parse.js"
import {SelectedCommand} from "../types/analysis.js"
import {listAllCommands} from "./list-all-commands.js"
import {Command, CommandTree} from "../types/commands.js"

export function listRelevantCommands(argw: string[], commands: CommandTree) {
	return listAllCommands(commands)
		.filter(({path}) => isCommandMatching(argw, path))
}

export function selectCommand(argw: string[], commands: CommandTree) {
	function recurse(c: CommandTree, path: string[]): SelectedCommand | undefined {
		if (c instanceof Command) {
			if (isCommandMatching(argw, path)) {
				const argx = argw.slice(path.length)
				return {argx, path, command: c}
			}
		}
		else for (const [key, value] of Object.entries(c)) {
			const c2 = recurse(value, [...path, key])
			if (c2)
				return c2
		}
	}
	return recurse(commands, [])
}

export function getBooleanParams(command: Command) {
	return Object.entries(command.params)
		.filter(([,param]) => (
			param.flag ||
			param.mode === "flag" ||
			param.mode === "boolean"
		))
		.map(([name]) => name)
}

//////////////////

function isCommandMatching(argw: string[], path: string[]) {
	const {args} = parse(argw, {booleanParams: ["help"]})
	return path.every((part, index) => part === args[index])
}

