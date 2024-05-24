
import {parse} from "../parsing/parse.js"
import {CommandTree} from "./types/commands.js"
import {analyzeCommand} from "./utils/analyze-command.js"
import {produceTreeAnalysis} from "./utils/analyze-tree.js"
import {Analysis, AnalyzeOptions} from "./types/analysis.js"
import {selectCommand, getBooleanParams} from "./utils/utils.js"
import {CommandNotFoundError, UnknownFlagError, UnknownParamError} from "../../errors/kinds/mistakes.js"

/**
 * smartly read and validate command line input.
 *  - takes your `commands` config into account, and validates input as such.
 *  - input is validated and organized into a returned `tree` object.
 */
export function analyze<C extends CommandTree>(
		argw: string[],
		{commands}: AnalyzeOptions<C>
	): Analysis<C> {

	const selected = selectCommand(argw, commands)

	if (!selected)
		throw new CommandNotFoundError()

	const {argx, command, path} = selected
	const parsed = parse(argx, {booleanParams: getBooleanParams(command)})
	const commandAnalysis = analyzeCommand(path, command, parsed)

	for (const paramName of parsed.params.keys()) {
		if (!(paramName in commandAnalysis.params))
			throw new UnknownParamError(paramName)
	}

	for (const flag of parsed.flags.values()) {
		const specified = Object.values(command.params)
			.some(param => param.flag === flag)
		if (!specified)
			throw new UnknownFlagError(flag)
	}

	const tree = produceTreeAnalysis(commands, command, commandAnalysis)

	return {
		tree,
		commandSpec: command,
		command: commandAnalysis,
		extraArgs: commandAnalysis.extraArgs,
	}
}

