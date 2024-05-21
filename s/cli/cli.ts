
import {analyze} from "../analysis/analyze.js"
import {CliConfig, CliResult} from "./types.js"
import {checkHelp} from "../parsing/check-help.js"
import {printHelp} from "./printing/print-help.js"
import {printError} from "./printing/print-error.js"
import {MistakeError, FakeExit} from "../errors.js"
import {selectCommand} from "../analysis/utils/utils.js"
import {Command, CommandTree} from "../analysis/types/commands.js"

/**
 * process command line input.
 *  - reads args and params based on the provided config.
 *  - returns the data all nicely organized for you to use in your program.
 *  - autogenerates a tidy little --help page.
 */
export function cli<C extends CommandTree>(
		argv: string[],
		config: CliConfig<C>,
	): CliResult<C> {

	const [bin, script, ...argw] = argv

	const {
		columns,
		commands,
		onExit = code => process.exit(code),
		onHelp = help => console.log(help),
		onMistake = mistake => console.error(mistake),
	} = config

	try {
		const userProvidedHelpParam = checkHelp(argw)
		const selectedCommand = selectCommand(argw, commands)
		const thisCliHasOneSingleRootCommand = commands instanceof Command

		const userNeedsHelp = !selectedCommand
			&& !thisCliHasOneSingleRootCommand

		if (userProvidedHelpParam || userNeedsHelp) {
			onHelp(printHelp({...config, commands, selectedCommand}))
			onExit(0)
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
		if (error instanceof MistakeError) {
			onMistake(printError(error, columns))
			onExit(1)
		}
		else throw error
	}

	// if the user-supplied `onExit` fails to actually end the process,
	// we need to throw an error, so that typescript sees that this function
	// will never return undefined.
	throw new FakeExit("cli 'exit' failed to end process")
}

