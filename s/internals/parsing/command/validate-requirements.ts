
import {Group} from "../../fielding/group.js"
import {Values} from "../../fielding/values.js"
import {ArgvError} from "../../erroring/argv-error.js"

export function validateRequirements(fields: Group, values: Values) {
	for (const [key, field] of Object.entries(fields)) {
		if (field.mode === "requirement")
			if (!(key in values))
				throw new ArgvError(`missing required arg "${key}"`)
	}
}
