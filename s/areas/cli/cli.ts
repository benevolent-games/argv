
import {analyze} from "../analysis/analyze.js"
import {CliConfig, CliResult} from "./types.js"
import {printHelp} from "./printing/print-help.js"
import {checkHelp} from "../parsing/check-help.js"
import {Tn, tnFinal} from "../../tooling/text/tn.js"
import {printError} from "./printing/print-error.js"
import {CommandTree} from "../analysis/types/commands.js"
import {FakeExit, MistakeError} from "../../errors/basic.js"
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
		columns = process.stdout.columns,
		onExit = code => process.exit(code),
		onHelp = help => console.log(help),
		onMistake = mistake => console.error(mistake),
	} = config

	const format = (tn: Tn) => tnFinal(columns, indent, tn)

	try {
		const userAskedForHelp = checkHelp(argw)
		const selectedCommand = selectCommand(argw, commands)
		const relevantCommands = listRelevantCommands(argw, commands)
		const userNeedsHelp = !selectedCommand

		if (relevantCommands.length === 0)
			throw new MistakeError(`invalid command`)

		if (userAskedForHelp || userNeedsHelp) {
			const help = printHelp({...config, selectedCommand, relevantCommands})
			onHelp(format(help) + "\n")
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
			const mistake = format(printError(error))
			onMistake(mistake)
			onExit(1)
		}
		else throw error
	}

	// if the user-supplied `onExit` fails to actually end the process,
	// we need to throw an error, so that typescript sees that this function
	// will never return undefined.
	throw new FakeExit("cli 'exit' failed to end process")
}

