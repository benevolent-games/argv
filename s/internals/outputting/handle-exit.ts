
import {Output} from "./output.js"
import {Config} from "../configuring/config.js"
import {ProgramResult} from "./program-result.js"
import {Commands} from "../commanding/commands.js"

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
