
import {Commands} from "../../commanding/commands.js"
import {isCommand} from "../../commanding/is-command.js"

export function parseTuples(commands: Commands) {
	const collection: string[][] = []

	function recurse(subject: Commands, path: string[]) {
		if (isCommand(subject))
			collection.push(path)
		else {
			for (const [key, value] of Object.entries(subject)) {
				recurse(value, [...path, key])
			}
		}
	}

	recurse(commands, [])
	return collection
}
