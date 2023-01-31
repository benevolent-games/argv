
import {Field} from "./types/field.js"
import {Values} from "./types/values.js"
import {obtain} from "./tools/obtain.js"
import {stdtheme, Theme} from "./theme.js"
import {parse2} from "./internals/parse2.js"
import {helper3} from "./internals/helper.js"
import {errorReport} from "./internals/error-report.js"
import {Logger} from "./internals/testing/utils/logger.js"
import {applyDefaults} from "./internals/parsing/apply-defaults.js"
import {validateRequirements} from "./internals/parsing/validate-requirements.js"

export interface Command<A extends Values = Values, P extends Values = Values> {

	/** description and usage instructions for this command */
	help: string

	/** positional arguments this command will accept, in order */
	argorder: (keyof A)[]

	/** arguments specification */
	args: Field.GroupFromValues<A>

	/** parameters specification */
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

	/** the name of your program's executable */
	name: string

	/** url to your program's readme */
	readme: string

	/** description and usage instructions for your program */
	help: string

	/** command line arguments (in node, use process.argv) */
	argv?: string[]

	/** current terminal width, used for text-wrapping */
	columns?: number

	/** specify a logger that will be used to write outputs */
	logger?: Logger

	/** display "tips" section at end of +help page */
	tips?: boolean

	/** color palette to use in the +help page */
	theme?: Theme

	/** describe the commands your program can accept */
	commands: CommandSetup<C>

	/** function that is called to exit the process early */
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

// export type Result<C extends Commands> = {
// 	[P in keyof C]: C[P] extends Command
// 		? {
// 			args: Field.ValuesFromGroup<C["args"]>,
// 			params: Field.ValuesFromGroup<C["params"]>,
// 		}
// }

export function program<A extends Values, P extends Values>() {
	return function<C extends Commands>(spec: NuSpec<C>) {

		spec.argv ??= process.argv
		spec.columns ??= process.stdout.columns ?? 72
		spec.logger ??= console
		spec.exit ??= code => process.exit(code)
		spec.tips ??= true
		spec.theme ??= stdtheme

		const {logger} = spec

		const tree = spec.commands(asCommand)
		const tuples = parseTuples(tree)
		const [executable, module, ...parts] = spec.argv

		const matchingTuple = tuples.find(tupleMatches(parts))

		if (!matchingTuple)
			throw new Error("unknown command")

		const command = <Command>obtain(tree, matchingTuple)
		const items = getArgsFollowingCommandTuple(matchingTuple, parts)

		const {args, params} = parse2(command, items)
		const validCommand = {command, args, params, tuple: matchingTuple}

		try {
			if ("help" in command.params) {
				for (const report of helper3({spec, validCommand}))
					logger.log(report)

				return <any>spec.exit(0)
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

			for (const report of helper3({spec, validCommand}))
				logger.error(report)

			logger.error("")
			printError()
			return <any>spec.exit(1)
		}

		return {
			executable,
			module,
			args: args as A,
			params: params as P,
		}
	}
}
