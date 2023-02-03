
import {Theme} from "./theme.js"
import {Field} from "./types/field.js"
import {parse3, parse4} from "./internals/parse2.js"
import {Logger} from "./internals/testing/utils/logger.js"
import {tupleMatches} from "./program.js"

export interface Environment {
	argv: string[]
	columns: number
	logger: Logger
	exit: (code: number) => never
}

export interface Settings {
	name: string
	help: string
	readme: string
	tips: boolean
	theme: Theme
}

export type Config = Environment & Settings

export interface ParseResult<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group
	> {
	args: Field.ValuesFromGroup<FA>
	params: Field.ValuesFromGroup<FP>
	executable: string
	module: string
	cmd: string
}

export interface CommandSpec<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group
	> {
	cmd: string
	help: string
	argorder: (keyof FA)[]
	args: FA
	params: FP
	execute: ({}: ParseResult<FA, FP>) => Promise<void>
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

export function inputMatchesCommand(cmd: string, argv: string[]) {
	const [,,...parts] = argv
	const tuple = cmd.toLowerCase().split(" ")
	const isMatch = tuple.reduce(
		(match, word, index) => (match && (word === parts[index])),
		true,
	)
	return isMatch
}

export function inputMatchesCommand2(cmd: string, argv: string[]) {
	const [,,...parts] = argv
	const cmd2 = cmd.toLowerCase()
	const input = parts.join(" ").toLowerCase()
	return cmd2
		? input.startsWith(cmd2)
		: true
}

export class CliState {
	#knownCommands: string[] = []
	#exit: undefined | {code: number, error?: Error}
	#executionResult: undefined | {
		cmd: string
		promise: Promise<void>
	}

	isCommandAlreadyRegistered(cmd: string) {
		return this.#knownCommands.some(
			knownCmd => knownCmd.startsWith(cmd)
		)
	}

	registerCommand(cmd: string) {
		this.#knownCommands.push(cmd)
	}

	fatalError(error?: Error) {
		this.#exit = {code: -1, error}
	}

	get done() {
		return !!this.#exit
	}

	execute(cmd: string, promise: Promise<void>) {
		this.#executionResult = {cmd, promise}
	}
}

export class CommandRegistry {
	static isUnknownCommand(spec?: CommandSpec) {
		return !spec
	}

	#registeredCommands: CommandSpec[] = []

	register(spec: CommandSpec) {
		this.#registeredCommands.push(spec)
	}

	hasDuplicates() {
		return this.#registeredCommands.some(
			({cmd: cmdA}, indexA) => this.#registeredCommands.some(
				({cmd: cmdB}, indexB) => (
					(indexA !== indexB) &&
						thisTuple(tupleFrom.cmd(cmdA))
							.startsWith(tupleFrom.cmd(cmdB))
				)
			)
		)
	}

	match(argv: string[]) {
		return this.#registeredCommands.find(
			({cmd}) => (
				thisTuple(tupleFrom.cmd(cmd))
					.startsWith(tupleFrom.argv(argv))
			)
		)
	}
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

export function program5(config: Config) {
	const {argv, logger} = config
	const commandRegistry = new CommandRegistry()
	const chain = {command, wait, exit}

	function command<FA extends Field.Group, FP extends Field.Group>(
			spec: CommandSpec<FA, FP>,
		) {
		commandRegistry.register(spec as CommandSpec)
		return chain
	}

	async function wait() {
		try {
			if (commandRegistry.hasDuplicates())
				throw new Error("duplicate command")

			const spec = isDefined(commandRegistry.match(argv))
				.otherwiseThrow(Error)
				.withMessage("unknown error")

			await spec.execute(parse4(spec, argv))
			return {code: 0}
		}
		catch (error) {
			return error instanceof Error
				? {code: -1, error}
				: {code: -1, error: new Error("unknown error")}
		}
	}

	async function exit() {
		const {code, error} = await wait()

		if (error)
			logger.error(`${error.name} ${error.message}`)

		config.exit(code)
	}

	return chain
}

export function program4(config: Config) {
	const state = new CliState()

	function command<FA extends Field.Group, FP extends Field.Group>(
			cmd: string,
			spec: CommandSpec<FA, FP>,
		) {

		if (state.isCommandAlreadyRegistered(cmd))
			state.fatalError(new Error(`duplicate command specification "${cmd}"`))
		else
			state.registerCommand(cmd)

		if (state.done) {
		}
		else {
			if (inputMatchesCommand2(cmd, config.argv))
				state.execute(cmd, spec.execute(parse3(spec, cmd, config.argv)))
		}
	}
}

export function program3(config: Config) {

	let executed: undefined | {
		cmd: string
		promise: Promise<void>
	}

	async function wait() {
		if (executed)
			return executed.promise
		else
			throw new Error(`unknown command "${config.argv.slice(2).join(" ")}"`)
	}

	function dummy() {
		return dummyChain
	}

	const chain = {command, wait}
	const dummyChain = {command: dummy, wait}

	function command<FA extends Field.Group, FP extends Field.Group>(
			cmd: string,
			spec: CommandSpec<FA, FP>,
		) {

		if (inputMatchesCommand2(cmd, config.argv))
			executed = {
				cmd,
				promise: spec.execute(parse3(spec, cmd, config.argv)),
			}

		return executed
			? dummyChain
			: chain
	}

	return {command, wait}
}

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
