
import {Command, CommandTree} from "./types/basic.js"
import {ParseResult} from "./types/advanced.js"

export type ParseConfig<C extends CommandTree> = {
	argv: string[]
	commands: C
}

export function parse<C extends CommandTree>(config: ParseConfig<C>) {

	function recurse(c: CommandTree, path: string[]) {
		if (c instanceof Command) {
		}
	}

	return undefined as any as ParseResult<C>
}

