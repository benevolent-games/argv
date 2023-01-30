
import {Spec} from "../../types/spec.js"
import {Command} from "../../program.js"
import {ArgvError} from "../../errors/argv-error.js"

export function validateArgOrdering2(command: Command) {
	if (command.argorder.length !== Object.keys(command.args).length)
		throw new ArgvError(`mismatch between "argorder" and "args"`)
}

export function validateArgOrdering(spec: Spec<any, any>) {
	if (spec.argorder.length !== Object.keys(spec.args).length)
		throw new ArgvError(`mismatch between "argorder" and "args"`)
}
