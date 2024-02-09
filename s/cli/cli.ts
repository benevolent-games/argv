
import {parse} from "./parsing/parse.js"
import {Logger} from "../tooling/logger.js"
import {CommandTree} from "./parsing/types/basic.js"

export type CliConfig<C extends CommandTree> = {
	name: string
	help?: string
	logger?: Logger
	columns?: number
	commands: C
}

export function cli<C extends CommandTree>(config: CliConfig<C>) {
	return parse(config.commands)
}

