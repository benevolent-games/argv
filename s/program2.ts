
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

export interface CommandSpec<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group
	> {
	help: `get information about a pack`,
	argorder: (keyof FA)[],
	args: FA,
	params: FP,
	execute: ({}: {
		args: Field.ValuesFromGroup<FA>
		params: Field.ValuesFromGroup<FP>
		executable: string
		module: string
	}) => Promise<void>
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
	const input = parts.join(" ").toLowerCase()
	return input.startsWith(cmd.toLowerCase())
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
				return {command: dummy, wait}
			}

			function command<FA extends Field.Group, FP extends Field.Group>(
					cmd: string,
					spec: CommandSpec<FA, FP>,
				) {

				if (inputMatchesCommand(cmd, environment.argv)) {
					executed = {
						cmd,
						promise: spec.execute(parse3(spec, cmd, environment.argv)),
					}
					return {command: dummy, wait}
				}
				else
					return {command, wait}
			}

			return {command, wait}
		},
	}),
})
