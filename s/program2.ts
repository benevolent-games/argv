
import {Theme} from "./theme.js"
import {Field} from "./types/field.js"
import {parse3} from "./internals/parse2.js"
import {Logger} from "./internals/testing/utils/logger.js"

export interface Environment {
	argv: string[]
	columns: number
	logger: Logger
	exit: (code: number) => never
}

export interface Settings {
	help: string
	readme: string
	tips: boolean
	theme: Theme
}

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
	help: `get information about a pack`,
	argorder: (keyof FA)[],
	args: FA,
	params: FP,
	execute: ({}: ParseResult<FA, FP>) => Promise<void>
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

export const program2 = (name: string) => ({
	environment: (environment: Environment) => ({
		settings: (settings: Settings) => {

			let executed: undefined | {
				cmd: string
				promise: Promise<void>
			}

			async function wait() {
				if (executed)
					return executed.promise
				else
					throw new Error(`unknown command "${environment.argv.slice(2).join(" ")}"`)
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

				if (inputMatchesCommand2(cmd, environment.argv))
					executed = {
						cmd,
						promise: spec.execute(parse3(spec, cmd, environment.argv)),
					}

				return executed
					? dummyChain
					: chain
			}

			return {command, wait}
		},
	}),
})
