
import {Commands} from "./commands.js"

export function isCommand(subject: Commands) {
	const conditions = [
		"argorder" in subject,
		"args" in subject,
		"params" in subject,
		"execute" in subject,
	]
	return conditions.every(c => c)
}
