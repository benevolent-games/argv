
import {analyze} from "../analysis/analyze.js"
import {CliConfig} from "./types/cli-config.js"
import {printHelp} from "./parts/print-help.js"
import {checkHelp} from "../parsing/check-help.js"
import {ConsoleLogger} from "../tooling/logger.js"
import {selectCommand} from "../analysis/utils/utils.js"
import {CommandTree} from "../analysis/types/commands.js"

export {CliConfig, cliConfig} from "./types/cli-config.js"

export function cli<C extends CommandTree>(
		argv: string[],
		config: CliConfig<C>,
	) {

	const [bin, script, ...argw] = argv
	const {
		commands,
		logger = new ConsoleLogger(),
	} = config

	const help = checkHelp(argw)
	const selectedCommand = selectCommand(argw, commands)

	if (help) {
		logger.log(printHelp({...config, commands, selectedCommand}))
		process.exit(0)
	}

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

