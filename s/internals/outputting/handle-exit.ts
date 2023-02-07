
import {Output} from "./output.js"
import {Config} from "../configuring/config.js"
import {ProgramResult} from "./program-result.js"
import {Commands} from "../commanding/commands.js"

export function handleExit<C extends Config<Commands>>(
		{exit, logger}: C,
		result: Output,
	): ProgramResult<C> {

	const {code, error} = result

	switch (exit) {

		case "throw_on_error":
			if (error)
				throw error
			return result as ProgramResult<C>

		case false:
			return result as ProgramResult<C>

		default:
			if (error)
				logger.error(`${error.name} ${error.message}`)

			exit(code)
			return undefined as ProgramResult<C>
	}
}
