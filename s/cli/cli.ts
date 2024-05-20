
import {analyze} from "../analysis/analyze.js"
import {CliConfig} from "./types/cli-config.js"
import {CommandTree} from "../analysis/types/commands.js"

export {CliConfig, cliConfig} from "./types/cli-config.js"

export function cli<C extends CommandTree>(
		argv: string[],
		{commands}: CliConfig<C>,
	) {
	const [bin, script, ...argw] = argv
	const analysis = analyze(argw, {commands})
	const execute = () => analysis.commandSpec.execute(analysis.command)
	return {
		bin,
		script,
		execute,
		tree: analysis.tree,
		command: analysis.command,
	}
}

