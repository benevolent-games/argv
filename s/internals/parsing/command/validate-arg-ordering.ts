
import {Command} from "../../commanding/command.js"
import {ArgvError} from "../../erroring/argv-error.js"

export function validateArgOrdering(command: Command) {
	if (command.argorder.length !== Object.keys(command.args).length)
		throw new ArgvError(`mismatch between "argorder" and "args"`)
}
