
import {themes} from "./themes.js"
import {analyze} from "../analysis/analyze.js"
import {CliConfig, CliResult} from "./types.js"
import {printHelp} from "./printing/print-help.js"
import {checkHelp} from "../parsing/check-help.js"
import {final} from "../../tooling/text/tn.js"
import {makePalette} from "../../tooling/text/theming.js"
import {CommandTree} from "../analysis/types/commands.js"
import {CommandNotFoundError} from "../../errors/kinds/mistakes.js"
import {ArgvError, ExitFail, MistakeError} from "../../errors/basic.js"
import {listRelevantCommands, selectCommand} from "../analysis/utils/utils.js"

/**
 * read input for a command line program.
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
		commands,
		indent = "  ",
		theme = themes.standard,
		columns = process.stdout.columns,
		onExit = code => process.exit(code),
		onHelp = help => console.log(help),
		onMistake = mistake => console.error(mistake),
	} = config

	const palette = makePalette(theme)

	const exit = (code: number) => {
		onExit(code)
		throw new ExitFail("cli 'onExit' failed to end process")
	}

	try {
		const userAskedForHelp = checkHelp(argw)
		const selectedCommand = selectCommand(argw, commands)
		const relevantCommands = listRelevantCommands(argw, commands)
		const userNeedsHelp = !selectedCommand

		if (relevantCommands.length === 0)
			throw new CommandNotFoundError()

		if (userAskedForHelp || userNeedsHelp) {
			const help = printHelp({...config, selectedCommand, relevantCommands, palette})
			const formatted = final(columns, indent, help)
			onHelp(formatted + "\n")
			return exit(0)
		}

		const analysis = analyze(argw, {commands})
		const execute = async() => {
			try {
				return await analysis.commandSpec.execute(analysis.command)
			}
			catch (error) {
				if (error instanceof ArgvError) {
					console.error(palette.error(error.message))
					return exit(1)
				}
				else throw error
			}
		}

		return {
			...analysis,
			bin,
			script,
			execute,
		}
	}
	catch (error) {
		if (error instanceof MistakeError) {
			onMistake(
				error.message
					? palette.error(error.message)
					: error.name
			)
			return exit(1)
		}
		else throw error
	}
}

cli.execute = async<C extends CommandTree>(
		argv: string[],
		config: CliConfig<C>,
	) => {
	return await cli(argv, config).execute()
}

