
import {parse} from "../parsing/parse.js"
import {CommandTree} from "./types/commands.js"
import {CommandNotFoundError, UnknownFlagError, UnknownParamError} from "../errors.js"
import {Analysis, AnalyzeOptions} from "./types/analysis.js"
import {analyzeCommand, distinguishCommand, extractBooleanParams, produceTreeAnalysis} from "./utils/utils.js"

export {CommandTree, AnalyzeOptions, Analysis}
export {command, arg, param} from "./helpers.js"

export function analyze<C extends CommandTree>(
		argw: string[],
		{commands, shorthandBooleans = false}: AnalyzeOptions<C>
	): Analysis<C> {

	const distinguished = distinguishCommand(argw, commands)

	if (!distinguished)
		throw new CommandNotFoundError()

	const {argx, command, path} = distinguished

	const booleanParams = shorthandBooleans
		? extractBooleanParams(command)
		: []

	const parsed = parse(argx, {booleanParams})
	const commandAnalysis = analyzeCommand(path, command, parsed)

	for (const paramName of parsed.params.keys()) {
		if (!(paramName in commandAnalysis.params))
			throw new UnknownParamError(paramName)
	}

	for (const flag of parsed.flags.values()) {
		const specified = Object.values(command.params)
			.some(param => param.mode === "flag" && param.flag === flag)
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

