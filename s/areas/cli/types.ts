
import {ArgvTheme} from "./themes.js"
import {Analysis} from "../analysis/types/analysis.js"
import {CommandTree} from "../analysis/types/commands.js"

export type CliConfig<C extends CommandTree> = {
	name: string
	columns: number
	commands: C
	readme?: string
	help?: string
	theme?: ArgvTheme
	shorthandBooleans?: boolean
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

