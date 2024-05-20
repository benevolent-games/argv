
import {ArgvTheme} from "../themes.js"
import {Logger} from "../../tooling/logger.js"
import {CommandTree} from "../../analysis/types/commands.js"

export type CliConfig<C extends CommandTree> = {
	name: string
	columns: number
	commands: C
	readme?: string
	help?: string
	logger?: Logger
	theme?: ArgvTheme
}

export function cliConfig<C extends CommandTree>(c: CliConfig<C>) {
	return c
}

