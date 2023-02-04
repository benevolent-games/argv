
import {Theme} from "./theme.js"
import {Field} from "./types/field.js"
// import {parse3, parse4} from "./internals/parse2.js"
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
		FP extends Field.Group = Field.Group
	> {
	args: Field.ValuesFromGroup<FA>
	params: Field.ValuesFromGroup<FP>
	cmd: string
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

export function program8<xCommands extends Commands>() {
	return async function<xConfig extends Config<xCommands>>(
			config: xConfig
		): Promise<ProgramResult<xConfig>> {

		const {logger, exit, argv, commands} = config

		const tree = commands(asCommand)
		const tuples = parseTuples(tree)
		const inputTuple = tupleFrom.argv(argv)
		const matchingCommandTuple = tuples.find(
			tuple => thisTuple(inputTuple).startsWith(tuple)
		)

		// const result: Output = await executeCommand()
		const result: Output = {code: 0}
		const {code, error} = result

		return handleExit(config, result)
	}
}

export async function program7<
		xConfig extends Config<Commands>
	>(config: xConfig): Promise<ProgramResult<xConfig>> {

	const {logger, exit, argv, commands} = config

	const tree = commands(asCommand)
	const tuples = parseTuples(tree)
	const inputTuple = tupleFrom.argv(argv)
	const matchingCommandTuple = tuples.find(
		tuple => thisTuple(inputTuple).startsWith(tuple)
	)

	// const result: Output = await executeCommand()
	const result: Output = {code: 0}
	const {code, error} = result

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

// export async function program6<C extends Config>(
// 		config: C
// 	): Promise<ProgramResult<C>> {

// 	const {logger, exit, argv, commands} = config

// 	const tree = commands(asCommand)
// 	const tuples = parseTuples(tree)
// 	const inputTuple = tupleFrom.argv(argv)
// 	const matchingCommandTuple = tuples.find(
// 		tuple => thisTuple(inputTuple).startsWith(tuple)
// 	)

// 	// const result: Output = await executeCommand()
// 	const result: Output = {code: 0}
// 	const {code, error} = result

// 	return handleExit(config, result)
// }

// export function inputMatchesCommand(cmd: string, argv: string[]) {
// 	const [,,...parts] = argv
// 	const tuple = cmd.toLowerCase().split(" ")
// 	const isMatch = tuple.reduce(
// 		(match, word, index) => (match && (word === parts[index])),
// 		true,
// 	)
// 	return isMatch
// }

// export function inputMatchesCommand2(cmd: string, argv: string[]) {
// 	const [,,...parts] = argv
// 	const cmd2 = cmd.toLowerCase()
// 	const input = parts.join(" ").toLowerCase()
// 	return cmd2
// 		? input.startsWith(cmd2)
// 		: true
// }

// export class CliState {
// 	#knownCommands: string[] = []
// 	#exit: undefined | {code: number, error?: Error}
// 	#executionResult: undefined | {
// 		cmd: string
// 		promise: Promise<void>
// 	}

// 	isCommandAlreadyRegistered(cmd: string) {
// 		return this.#knownCommands.some(
// 			knownCmd => knownCmd.startsWith(cmd)
// 		)
// 	}

// 	registerCommand(cmd: string) {
// 		this.#knownCommands.push(cmd)
// 	}

// 	fatalError(error?: Error) {
// 		this.#exit = {code: -1, error}
// 	}

// 	get done() {
// 		return !!this.#exit
// 	}

// 	execute(cmd: string, promise: Promise<void>) {
// 		this.#executionResult = {cmd, promise}
// 	}
// }

// export class CommandRegistry {
// 	static isUnknownCommand(spec?: CommandSpec) {
// 		return !spec
// 	}

// 	#registeredCommands: CommandSpec[] = []

// 	register(spec: CommandSpec) {
// 		this.#registeredCommands.push(spec)
// 	}

// 	hasDuplicates() {
// 		return this.#registeredCommands.some(
// 			({cmd: cmdA}, indexA) => this.#registeredCommands.some(
// 				({cmd: cmdB}, indexB) => (
// 					(indexA !== indexB) &&
// 						thisTuple(tupleFrom.cmd(cmdA))
// 							.startsWith(tupleFrom.cmd(cmdB))
// 				)
// 			)
// 		)
// 	}

// 	match(argv: string[]) {
// 		return this.#registeredCommands.find(
// 			({cmd}) => (
// 				thisTuple(tupleFrom.cmd(cmd))
// 					.startsWith(tupleFrom.argv(argv))
// 			)
// 		)
// 	}
// }

// export function program5(config: Config) {
// 	const {argv, logger} = config
// 	const commandRegistry = new CommandRegistry()
// 	const chain = {command, wait, exit}

// 	function command<FA extends Field.Group, FP extends Field.Group>(
// 			spec: CommandSpec<FA, FP>,
// 		) {
// 		commandRegistry.register(spec as CommandSpec)
// 		return chain
// 	}

// 	async function wait() {
// 		try {
// 			if (commandRegistry.hasDuplicates())
// 				throw new Error("duplicate command")

// 			const spec = isDefined(commandRegistry.match(argv))
// 				.otherwiseThrow(Error)
// 				.withMessage("unknown error")

// 			await spec.execute(parse4(spec, argv))
// 			return {code: 0}
// 		}
// 		catch (error) {
// 			return error instanceof Error
// 				? {code: -1, error}
// 				: {code: -1, error: new Error("unknown error")}
// 		}
// 	}

// 	async function exit() {
// 		const {code, error} = await wait()

// 		if (error)
// 			logger.error(`${error.name} ${error.message}`)

// 		// config.exit(code)
// 	}

// 	return chain
// }

// export function program4(config: Config) {
// 	const state = new CliState()

// 	function command<FA extends Field.Group, FP extends Field.Group>(
// 			cmd: string,
// 			spec: CommandSpec<FA, FP>,
// 		) {

// 		if (state.isCommandAlreadyRegistered(cmd))
// 			state.fatalError(new Error(`duplicate command specification "${cmd}"`))
// 		else
// 			state.registerCommand(cmd)

// 		if (state.done) {
// 		}
// 		else {
// 			if (inputMatchesCommand2(cmd, config.argv))
// 				state.execute(cmd, spec.execute(parse3(spec, cmd, config.argv)))
// 		}
// 	}
// }

// export function program3(config: Config) {

// 	let executed: undefined | {
// 		cmd: string
// 		promise: Promise<void>
// 	}

// 	async function wait() {
// 		if (executed)
// 			return executed.promise
// 		else
// 			throw new Error(`unknown command "${config.argv.slice(2).join(" ")}"`)
// 	}

// 	function dummy() {
// 		return dummyChain
// 	}

// 	const chain = {command, wait}
// 	const dummyChain = {command: dummy, wait}

// 	function command<FA extends Field.Group, FP extends Field.Group>(
// 			cmd: string,
// 			spec: CommandSpec<FA, FP>,
// 		) {

// 		if (inputMatchesCommand2(cmd, config.argv))
// 			executed = {
// 				cmd,
// 				promise: spec.execute(parse3(spec, cmd, config.argv)),
// 			}

// 		return executed
// 			? dummyChain
// 			: chain
// 	}

// 	return {command, wait}
// }

// export const program2 = (name: string) => ({
// 	environment: (environment: Environment) => ({
// 		settings: (settings: Settings) => {

// 			let executed: undefined | {
// 				cmd: string
// 				promise: Promise<void>
// 			}

// 			async function wait() {
// 				if (executed)
// 					return executed.promise
// 				else
// 					throw new Error(`unknown command "${environment.argv.slice(2).join(" ")}"`)
// 			}

// 			function dummy() {
// 				return dummyChain
// 			}

// 			const chain = {command, wait}
// 			const dummyChain = {command: dummy, wait}

// 			function command<FA extends Field.Group, FP extends Field.Group>(
// 					cmd: string,
// 					spec: CommandSpec<FA, FP>,
// 				) {

// 				if (inputMatchesCommand2(cmd, environment.argv))
// 					executed = {
// 						cmd,
// 						promise: spec.execute(parse3(spec, cmd, environment.argv)),
// 					}

// 				return executed
// 					? dummyChain
// 					: chain
// 			}

// 			return {command, wait}
// 		},
// 	}),
// })
