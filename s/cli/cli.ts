
import {InputError} from "../errors.js"
import {analyze} from "../analysis/analyze.js"
import {CliConfig} from "./types/cli-config.js"
import {checkHelp} from "../parsing/check-help.js"
import {CommandTree} from "../analysis/types/commands.js"

export {CliConfig, cliConfig} from "./types/cli-config.js"

export function cli<C extends CommandTree>(
		argv: string[],
		{commands}: CliConfig<C>,
	) {

	const [bin, script, ...argw] = argv
	const help = checkHelp(argw)

	try {
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
	catch (error) {
		if (error instanceof InputError) {
			process.exit(0)
		}
		else throw error
	}
}

