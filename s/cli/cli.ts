
import {CommandTree} from "./types/basic.js"
import {CliResult} from "./types/advanced.js"

export type CliConfig<C extends CommandTree> = {
	program: string
	help: string
	commands: C
}

export function cli<C extends CommandTree>({}: CliConfig<C>) {
	return undefined as any as CliResult<C>
}

