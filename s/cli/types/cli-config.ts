
import {Logger} from "../../tooling/logger.js"
import {CommandTree} from "../../analysis/types/commands.js"

export type CliConfig<C extends CommandTree> = {
	commands: C
	name: string
	help?: string
	logger?: Logger
	columns?: number
}

export function cliConfig<C extends CommandTree>(c: CliConfig<C>) {
	return c
}

