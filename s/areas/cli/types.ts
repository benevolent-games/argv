
import {ArgvTheme} from "./themes.js"
import {Analysis} from "../analysis/types/analysis.js"
import {CommandTree} from "../analysis/types/commands.js"

export type CliConfig<C extends CommandTree> = {
	name: string
	commands: C
	help?: string
	indent?: string
	readme?: string
	columns?: number
	theme?: ArgvTheme
	onExit?: (code: number) => void
	onHelp?: (help: string) => void
	onMistake?: (mistake: string) => void
}

export function cliConfig<C extends CommandTree>(c: CliConfig<C>) {
	return c
}

export type CliResult<C extends CommandTree> = {
	bin: string
	script: string
	execute: () => Promise<void>
} & Analysis<C>

