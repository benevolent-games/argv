
import {DisabledLogger} from "../utils/logger.js"
import {Command, Commands, CommandSetup, NuSpec, program} from "../../../program.js"
import {Values} from "../../../types/values.js"

export function dummyCommand() {
	return {
		help: `example dummy command`,
		argorder: [],
		args: {},
		params: {},
	} satisfies Command
}

export type DummyCommandSetup = (c: typeof dummyCommand) => Commands

export const dummyCommands = {
	simple: dummy => dummy(),
	nested: dummy => ({
		alpha: dummy(),
		bravo: {charlie: dummy()},
		delta: {echo: {foxtrot: dummy()}},
	}),
} satisfies {[key: string]: DummyCommandSetup}

export const dummyProgram = (
		cmds: DummyCommandSetup,
		args: string[],
	) => program()({
	name: "example",
	argv: ["node", "./script.js", ...args],
	columns: 72,
	readme: "https://github.com/benevolent-games/argv#readme",
	help: `example program`,
	commands: () => cmds(dummyCommand),
	logger: new DisabledLogger(),
})

export function exampleProgram<A extends Values, P extends Values>(commands: CommandSetup) {
	const makeArgv = (parts: string[]) => ["node", "./module.js", ...parts]

	const standard = {
		commands,
		name: "example",
		columns: 72,
		readme: "https://github.com/benevolent-games/argv#readme",
		help: `example program`,
		logger: new DisabledLogger(),
	}

	return (...parts: string[]) => program<A, P>()({
		...standard,
		argv: makeArgv(parts)
	})
}
