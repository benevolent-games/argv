
import {Field} from "./types/field.js"
import {Values} from "./types/values.js"
import {obtain} from "./tools/obtain.js"
import {parse2} from "./internals/parse2.js"
import {Logger} from "./internals/testing/utils/logger.js"
import {validateRequirements} from "./internals/parsing/validate-requirements.js"
import {applyDefaults} from "./internals/parsing/apply-defaults.js"
import {helper} from "./internals/helper.js"
import {Theme} from "./theme.js"
import {errorReport} from "./internals/error-report.js"

export interface Command<A extends Values = Values, P extends Values = Values> {
	help: string
	argorder: (keyof A)[]
	args: Field.GroupFromValues<A>
	params: Field.GroupFromValues<P>
}

export interface CommandTree {
	[key: string]: CommandTree | Command<Values, Values>
}

export type Commands = Command<Values, Values> | CommandTree

export function asCommand<A extends Values, P extends Values>(
		c: Command<A, P>,
	) {
	return c
}

export function isCommand(subject: Commands) {
	const conditions = [
		"help" in subject,
		"argorder" in subject,
		"args" in subject,
		"params" in subject,
	]
	return conditions.every(c => c)
}

export function assertCommand(commands: Commands) {
	if (isCommand(commands))
		return <Command<Values, Values>>commands
	else
		throw new Error("invalid command structure")
}

export interface NuSpec<C extends Commands = Commands> {
	name: string
	argv: string[]
	columns?: number

	readme: string
	help: string

	commands: (c: typeof asCommand) => C

	logger?: Logger
	exit?: (code: number) => void
}

export function parseTuples(commands: Commands) {
	const collection: string[][] = []

	function recurse(subject: Commands, path: string[]) {
		if (isCommand(subject))
			collection.push(path)
		else {
			for (const [key, value] of Object.entries(subject)) {
				recurse(value, [...path, key])
			}
		}
	}

	recurse(commands, [])
	return collection
}

export function tupleMatches(args: string[]) {
	return (tuple: string[]) => {
		return tuple.reduce(
			(match, word, index) =>
				match && word === args[index],
			true,
		)
	}
}

export type CommandSetup<C extends Commands = Commands> = (c: typeof asCommand) => C

export function getArgsFollowingCommandTuple(tuple: string[], args: string[]) {
	const length = tuple.length
	return (length > 0)
		? args.slice(tuple.length - 1)
		: args
}

export function program<A extends Values, P extends Values>() {
	return function<C extends Commands>(spec: {
			name: string
			readme: string
			help: string

			argv: string[]
			columns?: number

			commands: CommandSetup<C>

			logger?: Logger
			exit?: (code: number) => void

			/** display "tips" section at end of +help page */
			tips?: boolean

			/** color palette to use in the +help page */
			theme?: Theme
		}) {

		const {logger = console} = spec

		const tree = spec.commands(asCommand)
		const tuples = parseTuples(tree)
		const [executable, module, ...parts] = spec.argv

		const matchingTuple = tuples.find(tupleMatches(parts))

		if (!matchingTuple)
			throw new Error("unknown command")

		const command = <Command>obtain(tree, matchingTuple)
		const items = getArgsFollowingCommandTuple(matchingTuple, parts)

		const {args, params} = parse2(command, items)

		try {
			if ("help" in command.params) {
				for (const report of helper(command))
					logger.log(report)

				return <any>exit(0)
			}

			validateRequirements(command.args, args)
			validateRequirements(command.params, params)

			applyDefaults(command.args, args)
			applyDefaults(command.params, params)
		}
		catch (err: any) {
			const errortext = errorReport(err)
			const printError = () => logger.error(errortext.join(" "))
			printError()
			logger.error("")

			for (const report of helper({spec}))
				logger.error(report)

			logger.error("")
			printError()
			return <any>exit(1)
		}

		return {
			executable,
			module,
			args: args as A,
			params: params as P,
		}
	}
}
