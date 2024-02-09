
import {parse} from "./parsing/parse.js"
import {Logger} from "../tooling/logger.js"
import {CommandTree} from "./parsing/types/basic.js"
import {ParseTree} from "./parsing/types/advanced.js"

export type CliConfig<C extends CommandTree> = {
	name: string
	help?: string
	logger?: Logger
	columns?: number
	argv: string[]
	commands: C
}

export function cli<C extends CommandTree>(config: CliConfig<C>): ParseTree<C> {
	const result = parse(config)
	return result.tree
}

