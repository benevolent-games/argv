
import {CliConfig} from "./types.js"
import {InputError} from "../errors.js"
import {analyze} from "../analysis/analyze.js"
import {checkHelp} from "../parsing/check-help.js"
import {ConsoleLogger} from "../tooling/logger.js"
import {printHelp} from "./printing/print-help.js"
import {printError} from "./printing/print-error.js"
import {selectCommand} from "../analysis/utils/utils.js"
import {Command, CommandTree} from "../analysis/types/commands.js"

export function cli<C extends CommandTree>(
		argv: string[],
		config: CliConfig<C>,
	) {

	const [bin, script, ...argw] = argv

	const {
		columns,
		commands,
		logger = new ConsoleLogger(),
	} = config

	try {
		const userProvidedHelpParam = checkHelp(argw)
		const selectedCommand = selectCommand(argw, commands)
		const thisCliHasOneSingleRootCommand = commands instanceof Command

		const userNeedsHelp = !selectedCommand
			&& !thisCliHasOneSingleRootCommand

		if (userProvidedHelpParam || userNeedsHelp) {
			logger.log(printHelp({...config, commands, selectedCommand}))
			process.exit(0)
		}

		const analysis = analyze(argw, {commands})
		const execute = () => analysis.commandSpec.execute(analysis.command)
		return {
			...analysis,
			bin,
			script,
			execute,
		}
	}
	catch (error) {
		if (error instanceof InputError)
			logger.error(printError(error, columns))
		else
			throw error
		process.exit(1)
	}
}

