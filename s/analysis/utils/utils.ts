
import {parse} from "../../parsing/parse.js"
import {Parsed} from "../../parsing/types.js"
import {Primitive} from "../types/primitives.js"
import {Command, CommandTree} from "../types/commands.js"
import {CommandAnalysis, SelectedCommand, TreeAnalysis} from "../types/analysis.js"
import {InvalidFlagError, UnknownModeError, UnknownPrimitiveError} from "../../errors/kinds/config.js"
import {InvalidNumberError, RequiredArgError, RequiredParamError, ValidationError} from "../../errors/kinds/mistakes.js"

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

	function coerce(
			inputkind: "arg" | "param",
			name: string,
			primitive: Primitive,
			input: string,
			validate: (value: any) => any,
		) {
		const converted = convertPrimitive(inputkind, name, primitive, input)
		try {
			return validate(converted)
		}
		catch (error) {
			throw new ValidationError(
				(
					(inputkind === "arg")
						? `arg "${name}"`
						: `param --${name}`
				) + (
					(error instanceof Error)
						? ": " + error.message
						: ""
				)
			)
		}
	}

	const args = Object.fromEntries(command.args.map((argspec, index) => {
		const {mode, name, primitive, validate} = argspec
		const input = parsed.args.at(index)
		switch (mode) {

			case "required":
				if (input === undefined)
					throw new RequiredArgError(name)
				return [
					name,
					coerce("arg", name, primitive, input, validate),
				]

			case "optional":
				return [
					argspec.name,
					input
						? coerce("arg", name, primitive, input, validate)
						: undefined,
				]

			case "default":
				return [
					argspec.name,
					input
						? coerce("arg", name, primitive, input, validate)
						: argspec.fallback,
				]

			default:
				throw new UnknownModeError()
		}
	}))

	const params: Record<string, any> = Object.fromEntries(
		Object.entries(command.params).map(([name, paramspec]) => {
			const {mode, primitive, validate} = paramspec
			const input = parsed.params.get(name)
			switch (mode) {

				case "required":
					if (input === undefined)
						throw new RequiredParamError(name)
					return [
						name,
						coerce("param", name, primitive, input, validate),
					]

				case "flag":
					const flaginput = parsed.flags.has(paramspec.flag)
					return [
						name,
						flaginput
							? true
							: input
								? coerce("param", name, primitive, input, validate)
								: false,
					]

				case "optional":
					return [
						name,
						input
							? coerce("param", name, primitive, input, validate)
							: undefined,
					]

				case "default":
					return [
						name,
						input
							? coerce("param", name, primitive, input, validate)
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
	const {args} = parse(argw, {booleanParams: ["help"]})
	return path.every((part, index) => part === args[index])
}

function convertPrimitive(inputkind: "arg" | "param", name: string, primitive: Primitive, input: string) {
	switch (primitive) {

		case String:
			return input

		case Boolean:
			return truisms.some(s => s === input.toLowerCase())

		case Number: {
			const n = Number(input)
			if (isNaN(n))
				throw new InvalidNumberError(
					`${(
						(inputkind === "arg")
							? `arg "${name}"`
							: `param --${name}`
					)} is not a valid number (got "${input}")`
				)
			return Number(input)
		}

		default:
			throw new UnknownPrimitiveError(name)
	}
}

