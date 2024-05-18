
import {Logger} from "../tooling/logger.js"
import {CommandTree} from "../analysis/types/basic.js"
import {ParseTree} from "../analysis/types/advanced.js"
import {AnalysisConfig, analyze} from "../analysis/analyze.js"

export type CliConfig<C extends CommandTree> = {
	name: string
	help?: string
	logger?: Logger
	columns?: number
} & AnalysisConfig<C>

export function cli<C extends CommandTree>(config: CliConfig<C>): ParseTree<C> {
	const {tree} = analyze(config)
	return tree
}

