
import {thisTuple} from "./this-tuple.js"
import {tupleFrom} from "./tuple-from.js"
import {Group} from "../../fielding/group.js"
import {parseTuples} from "./parse-tuples.js"
import {obtain} from "../../tooling/obtain.js"
import {parseCommand} from "../parse-command.js"
import {Command} from "../../commanding/command.js"
import {Commands} from "../../commanding/commands.js"
import {isCommand} from "../../commanding/is-command.js"
import {ParseResult} from "../../commanding/parse-result.js"

export function findAndParseCommand(
		tree: Commands,
		argv: string[],
	): {command: Command, details: ParseResult<Group, Group>} | undefined {

	let tuple: string[] | undefined
	let command: Command | undefined

	if (isCommand(tree)) {
		command = tree as any
	}
	else {
		const input = tupleFrom.argv(argv)
		tuple = (
			parseTuples(tree)
				.find(t => thisTuple(input).startsWith(t))
		)
		if (tuple)
			command = obtain(tree, tuple) as Command
	}

	return command
		? {
			command,
			details: parseCommand(tuple ?? [], command, argv),
		}
		: undefined
}
