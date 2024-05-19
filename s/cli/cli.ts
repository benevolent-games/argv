
import {Logger} from "../tooling/logger.js"
import {analyze} from "../analysis/analyze.js"
import {CommandTree} from "../analysis/types/commands.js"

export type CliOptions<C extends CommandTree> = {
	argv: string[]
	commands: C
	name: string
	help?: string
	logger?: Logger
	columns?: number
}

export function cli<C extends CommandTree>(o: CliOptions<C>) {
	const [bin, script, ...argw] = o.argv
	const analysis = analyze({
		argw,
		commands: o.commands,
	})

	if (!analysis)
		return null

	const execute = () => analysis.spec.execute(analysis.command)

	return {
		bin,
		script,
		execute,
		tree: analysis.tree,
		command: analysis.command,
	}
}

