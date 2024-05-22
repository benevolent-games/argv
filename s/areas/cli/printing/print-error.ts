
import {wrap} from "../../../tooling/text/wrap.js"
import {default_columns} from "./default-columns.js"
import {color} from "../../../tooling/text/coloring.js"
import {ArgvError, ConfigError} from "../../../errors/basic.js"

export function printError(
		error: ArgvError,
		columns: number = default_columns,
	) {
	const content = [

		(error instanceof ConfigError)
			? color.brightMagenta("(Argv Configuration Error)")
			: null,

		color.brightRed(error.name),

		(error.message)
			? color.red(error.message)
			: null,

	].filter(s => !!s).join("\n")
	return wrap(columns, content)
}

