
import {Spec5} from "../types/spec.js"
import {ArgvError} from "../errors/argv-error.js"

export function validateArgOrdering(spec: Spec5<any, any>) {

	if (spec.argorder.length !== Object.keys(spec.args).length)
		throw new ArgvError(`mismatch between "argorder" and "args"`)
}
