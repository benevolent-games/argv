
import {Logger} from "../tooling/logger.js"
import {CommandTree} from "./parsing/types/basic.js"
import {ParseTree} from "./parsing/types/advanced.js"
import {ParseConfig, parse} from "./parsing/parse.js"

export type CliConfig<C extends CommandTree> = {
	name: string
	help?: string
	logger?: Logger
	columns?: number
} & ParseConfig<C>

export function cli<C extends CommandTree>(config: CliConfig<C>): ParseTree<C> {
	const {tree: tree} = parse(config)
	return tree
}

