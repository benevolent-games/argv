
import {Parsed} from "../../parsing/types.js"
import {Primitive} from "../types/primitives.js"
import {Command, CommandTree} from "../types/commands.js"
import {CommandAnalysis, SelectedCommand, TreeAnalysis} from "../types/analysis.js"
import {InvalidFlagError, InvalidNumberError, RequiredArgError, RequiredParamError, UnknownModeError, UnknownPrimitiveError} from "../../errors.js"

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

export function extractBooleanParams(command: Command) {
	const booleanParams: string[] = []
	for (const [name, param] of Object.entries(command.params))
		if (param.primitive === Boolean)
			booleanParams.push(name)
	return booleanParams
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

	const args = Object.fromEntries(command.args.map((argspec, index) => {
		const {name} = argspec
		const input = parsed.args.at(index)
		switch (argspec.mode) {

			case "required":
				if (input === undefined)
					throw new RequiredArgError(argspec.name)
				return [
					argspec.name,
					convertPrimitive(name, argspec.primitive, input),
				]

			case "optional":
				return [
					argspec.name,
					input
						? convertPrimitive(name, argspec.primitive, input)
						: undefined,
				]

			case "default":
				return [
					argspec.name,
					input
						? convertPrimitive(name, argspec.primitive, input)
						: argspec.fallback,
				]

			default:
				throw new UnknownModeError()
		}
	}))

	const params: Record<string, any> = Object.fromEntries(
		Object.entries(command.params).map(([key, paramspec]) => {
			const input = parsed.params.get(key)
			switch (paramspec.mode) {

				case "required":
					if (input === undefined)
						throw new RequiredParamError(key)
					return [
						key,
						convertPrimitive(key, paramspec.primitive, input),
					]

				case "flag":
					const flaginput = parsed.flags.has(paramspec.flag)
					return [
						key,
						flaginput
							? true
							: input
								? convertPrimitive(key, Boolean, input)
								: false,
					]

				case "optional":
					return [
						key,
						input
							? convertPrimitive(key, paramspec.primitive, input)
							: undefined,
					]

				case "default":
					return [
						key,
						input
							? convertPrimitive(key, paramspec.primitive, input)
							: paramspec.fallback,
					]

				default:
					throw new UnknownModeError()
			}
		})
	)

	const extraArgs = (parsed.args.length > command.args.length)
		? parsed.args.slice(command.args.length)
		: []

	return {path, args, params, extraArgs}
}

export function processFlag(flag: string) {
	flag = flag.startsWith("-")
		? flag.slice(1)
		: flag
	if (flag.length !== 1)
		throw new InvalidFlagError(flag)
	return flag
}

///////////////////////////
///////////////////////////

const truisms = ["true", "yes", "on"]

function isCommandMatching(argw: string[], path: string[]) {
	return path.every((part, index) => part === argw[index])
}

function convertPrimitive(name: string, primitive: Primitive, input: string) {
	switch (primitive) {

		case String:
			return input

		case Boolean:
			return truisms.some(s => s === input.toLowerCase())

		case Number:
			const n = Number(input)
			if (isNaN(n))
				throw new InvalidNumberError(name, input)
			return Number(input)

		default:
			throw new UnknownPrimitiveError(name)
	}
}

