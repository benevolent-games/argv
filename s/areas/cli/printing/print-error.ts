
import {tnConnect} from "../../../tooling/text/tn.js"
import {color} from "../../../tooling/text/coloring.js"
import {ArgvError, ConfigError} from "../../../errors/basic.js"

export function printError(error: ArgvError) {
	return tnConnect("", [

		error instanceof ConfigError
			&& color.brightMagenta("(Argv Configuration Error)"),

		error.message
			&& color.brightRed(error.message),
	])
}

