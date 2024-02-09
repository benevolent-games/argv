
import {CommandTree} from "./types/basic.js"
import {ParseResult} from "./types/advanced.js"

export function parse<C extends CommandTree>(commands: C) {
	return undefined as any as ParseResult<C>
}

