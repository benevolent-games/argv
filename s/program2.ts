
import {Theme} from "./theme.js"
import {Field} from "./types/field.js"
import {obtain} from "./tools/obtain.js"
import {parse5} from "./internals/parse5.js"
import {Logger} from "./internals/testing/utils/logger.js"

export interface Environment {
	argv: string[]
	columns: number
	logger: Logger
	exit: false | ((code: number) => void)
}

export interface Settings {
	name: string
	help: string
	readme: string
	tips: boolean
	theme: Theme
}

export type Config<C extends Commands> = Environment & Settings & {
	commands: CommandSetup<C>
}

export interface ParseResult<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group,
	> {
	args: Field.ValuesFromGroup<FA>
	params: Field.ValuesFromGroup<FP>
	executable: string
	module: string
}

export interface CommandSpec2<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group
	> {
	help: string
	argorder: (keyof FA)[]
	args: FA
	params: FP
	execute: ({}: ParseResult<FA, FP>) => Promise<void>
}

export interface CommandTree {
	[key: string]: CommandTree | CommandSpec2<any, any>
}

export type Commands = CommandSpec2 | CommandTree

export function asCommand<
		FA extends Field.Group,
		FP extends Field.Group,
	>(c: CommandSpec2<FA, FP>) {
	return c
}

export type CommandSetup<C extends Commands> = (c: typeof asCommand) => C

export function isCommand(subject: Commands) {
	const conditions = [
		"help" in subject,
		"argorder" in subject,
		"args" in subject,
		"params" in subject,
		"execute" in subject,
	]
	return conditions.every(c => c)
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

export const thisTuple = (a: string[]) => ({
	startsWith(b: string[]) {
		return a.reduce(
			(match, word, index) => (match && (word === b[index])),
			true,
		)
	}
})

export const tupleFrom = {
	cmd(cmd: string) {
		return cmd.toLowerCase().split(" ")
	},
	argv(argv: string[]) {
		const [,,...parts] = argv
		return parts.map(part => part.toLowerCase())
	},
}

export const isDefined = <X>(x: X) => ({
	otherwiseThrow: (E: new(message: string) => Error) => ({
		withMessage: (message: string): NonNullable<X> => {
			if (x)
				return x
			else
				throw new E(message)
		}
	})
})

export type Output = {
	code: number
	error?: Error
}

export type ProgramResult<C extends Config<Commands>> = (
	C["exit"] extends false
		? Output
		: void
)

export function getArgsFollowingCommandTuple(
		tuple: string[],
		args: string[],
	) {
	return (tuple.length > 0)
		? args.slice(tuple.length - 1)
		: args
}

export async function program7<
		xConfig extends Config<Commands>
	>(config: xConfig): Promise<ProgramResult<xConfig>> {

	const {logger, argv, commands} = config

	const tree = commands(asCommand)
	const tuples = parseTuples(tree)
	const inputTuple = tupleFrom.argv(argv)
	const tuple = tuples.find(
		t => thisTuple(inputTuple).startsWith(t)
	)

	let result: Output

	if (tuple) {
		const command = obtain(commands, tuple) as CommandSpec2
		const parsed = parse5(
			tuple,
			command,
			argv,
		)
		try {
			await command.execute(parsed)
			result = {code: 0}
		}
		catch (error) {
			result = {
				code: -1,
				error: error instanceof Error
					? error
					: new Error("unknown error"),
			}
		}
	}
	else {
		result = {code: -1, error: new Error("unknown command")}
	}

	return handleExit(config, result)
}

export function handleExit<C extends Config<Commands>>(
		{exit, logger}: C,
		result: Output,
	): ProgramResult<C> {

	const {code, error} = result

	if (exit === false) {
		return result as ProgramResult<C>
	}
	else {
		if (error)
			logger.error(`${error.name} ${error.message}`)

		exit(code)
		return undefined as ProgramResult<C>
	}
}
