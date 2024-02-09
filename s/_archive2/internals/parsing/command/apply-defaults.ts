
import {Group} from "../../fielding/group.js"
import {Values} from "../../fielding/values.js"

export function applyDefaults(fields: Group, values: Values) {
	for (const [key, field] of Object.entries(fields)) {
		if (field.mode === "default") {
			if (!(key in values)) {
				values[key] = field.default
			}
		}
	}
}
