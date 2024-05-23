
import {parse} from "../../parsing/parse.js"
import {Parsed} from "../../parsing/types.js"
import {Command, CommandTree} from "../types/commands.js"
import {CommandAnalysis, SelectedCommand, TreeAnalysis} from "../types/analysis.js"

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

export function analyzeCommand(
		path: string[],
		command: Command,
		parsed: Parsed,
	): CommandAnalysis<Command> {

	const args = Object.fromEntries(
		command.args.map((arg, index) => {
			const input = parsed.args.at(index)
			return [arg.name, arg.coerce(input)]
		})
	)

	const params = Object.fromEntries(
		Object.entries(command.params)
			.map(([name, param]) => {
				if (param.flag) {
					return parsed.flags.has(param.flag)
						? [name, true]
						: [name, false]
				}
				else {
					const input = parsed.params.get(name)
					return [name, param.coerce(input)]
				}
			})
	)

	const extraArgs = (parsed.args.length > command.args.length)
		? parsed.args.slice(command.args.length)
		: []

	return {path, args, params, extraArgs}
}

export function getFlagNames(command: Command) {
	return Object.entries(command.params)
		.filter(([,param]) => !!param.flag)
		.map(([name]) => name)
}

///////////////////////////
///////////////////////////

function isCommandMatching(argw: string[], path: string[]) {
	const {args} = parse(argw, {booleanParams: ["help"]})
	return path.every((part, index) => part === args[index])
}

