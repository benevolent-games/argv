
import {parse} from "../parsing/parse.js"
import {Parsed} from "../parsing/types.js"
import {Primitive} from "./types/primitives.js"
import {Command, CommandTree} from "./types/commands.js"
import {CommandAnalysis, TreeAnalysis} from "./types/analysis.js"

export function analyze<C extends CommandTree>(
		argw: string[],
		commands: C,
	) {
	const distinguished = distinguishCommand(argw, commands)
	if (!distinguished)
		return null
	const {argx, command, path} = distinguished
	const parsed = parse(argx, extractParseOptions(command))
	const commandAnalysis = analyzeCommand(path, command, parsed)
	const tree = walker(commands, command, commandAnalysis)
	return {
		tree,
		spec: command,
		command: commandAnalysis,
	}
}

function walker<C extends CommandTree>(
		commands: C,
		command: Command,
		commandAnalysis: CommandAnalysis<Command>,
	) {
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
	return recurse(commands, []) as TreeAnalysis<C>
}

function extractParseOptions(command: Command) {
	const booleanParams: string[] = []
	for (const [name, param] of Object.entries(command.params))
		if (param.primitive === Boolean)
			booleanParams.push(name)
	return {booleanParams}
}

type Distinguished = {
	argx: string[]
	path: string[]
	command: Command
}

function distinguishCommand(argw: string[], commands: CommandTree) {
	function recurse(c: CommandTree, path: string[]): Distinguished | undefined {
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

function isCommandMatching(argw: string[], path: string[]) {
	return path.every((part, index) => part === argw[index])
}

const truisms = ["true", "yes", "on"]

function analyzeCommand(
		path: string[],
		command: Command,
		parsed: Parsed,
	): CommandAnalysis<Command> {

	const args = Object.fromEntries(command.args.map((argspec, index) => {
		const input = parsed.args.at(index)
		switch (argspec.mode) {

			case "required":
				if (input === undefined)
					throw new Error(`required argument "${argspec.name}"`)
				return [
					argspec.name,
					convertPrimitive(argspec.primitive, input),
				]

			case "optional":
				return [
					argspec.name,
					input
						? convertPrimitive(argspec.primitive, input)
						: undefined,
				]

			case "default":
				return [
					argspec.name,
					input
						? convertPrimitive(argspec.primitive, input)
						: argspec.fallback,
				]
		}
	}))

	const params: Record<string, any> = Object.fromEntries(
		Object.entries(command.params).map(([key, paramspec]) => {
			const input = parsed.params.get(key)
			switch (paramspec.mode) {

				case "required":
					if (input === undefined)
						throw new Error(`param required "--${key}"`)
					return [
						key,
						convertPrimitive(paramspec.primitive, input),
					]

				case "flag":
					return [
						key,
						input
							? convertPrimitive(paramspec.primitive, input)
							: false,
					]

				case "optional":
					return [
						key,
						input
							? convertPrimitive(paramspec.primitive, input)
							: undefined,
					]

				case "default":
					return [
						key,
						input
							? convertPrimitive(paramspec.primitive, input)
							: paramspec.fallback,
					]

				default:
					throw new Error(`unknown primitive`)
			}
		})
	)

	return {path, args, params}
}

function convertPrimitive(primitive: Primitive, input: string) {
	switch (primitive) {

		case String:
			return input

		case Boolean:
			return truisms.some(s => s === input.toLowerCase())

		case Number:
			return Number(input)

		default:
			throw new Error(`unknown primitive`)
	}
}

