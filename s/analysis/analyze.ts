
import {parse} from "../parsing/parse.js"
import {CommandTree} from "./types/commands.js"
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
		throw new Error(`invalid command`)

	const {argx, command, path} = distinguished

	const booleanParams = shorthandBooleans
		? extractBooleanParams(command)
		: []

	const parsed = parse(argx, {booleanParams})
	const commandAnalysis = analyzeCommand(path, command, parsed)

	for (const paramName of parsed.params.keys()) {
		if (!(paramName in commandAnalysis.params))
			throw new Error(`unknown param "--${paramName}"`)
	}

	const tree = produceTreeAnalysis(commands, command, commandAnalysis)

	return {
		tree,
		commandSpec: command,
		command: commandAnalysis,
		extraArgs: commandAnalysis.extraArgs,
	}
}

