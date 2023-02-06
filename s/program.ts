
import {obtain} from "./internals/tooling/obtain.js"
import {Output} from "./internals/outputting/output.js"
import {Config} from "./internals/configuring/config.js"
import {Command} from "./internals/commanding/command.js"
import {Commands} from "./internals/commanding/commands.js"
import {asCommand} from "./internals/commanding/as-command.js"
import {handleExit} from "./internals/outputting/handle-exit.js"
import {parseCommand} from "./internals/parsing/parse-command.js"
import {thisTuple} from "./internals/parsing/program/this-tuple.js"
import {tupleFrom} from "./internals/parsing/program/tuple-from.js"
import {ProgramResult} from "./internals/outputting/program-result.js"
import {parseTuples} from "./internals/parsing/program/parse-tuples.js"

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
		const command = obtain(commands, tuple) as Command
		const parsed = parseCommand(
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
