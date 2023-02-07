
import {Output} from "./internals/outputting/output.js"
import {Config} from "./internals/configuring/config.js"
import {asCommand} from "./internals/commanding/as-command.js"
import {handleExit} from "./internals/outputting/handle-exit.js"
import {ProgramResult} from "./internals/outputting/program-result.js"
import {findAndParseCommand} from "./internals/parsing/program/find-and-parse-command.js"

export async function program<
		xConfig extends Config
	>(config: xConfig): Promise<ProgramResult<xConfig>> {

	const {argv, commands} = config
	const tree = commands(asCommand)
	const parsed = findAndParseCommand(tree, argv)

	let result: Output

	if (parsed) {
		const {command, details} = parsed

		try {
			await command.execute(details)
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
	else
		result = {code: -1, error: new Error("unknown command")}

	return handleExit(config, result)
}
