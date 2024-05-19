
// import {Parsed} from "../parsing/types.js"
// import {parse as ezparse} from "../parsing/parse.js"
// import { CommandTree } from "./types/commands.js"
// import { AnalysisConfig, CommandAnalysis } from "./types/analysis.js"

// export function analyze<C extends CommandTree>(config: AnalysisConfig<C>) {
// 	const ez = ezparse(config.argv)
// 	let command: CommandAnalysis<Command> | undefined

// 	function recurse(c: CommandTree, path: string[]): any {
// 		if (c instanceof Command) {
// 			if (isCommandMatching(ez.args, path)) {
// 				command = analyzeCommand(path, c, ez)
// 				return command
// 			}
// 			else return undefined
// 		}
// 		else {
// 			return Object.fromEntries(
// 				Object.entries(c)
// 					.map(([key, c2]) => [key, recurse(c2, [...path, key])])
// 			)
// 		}
// 	}

// 	const tree = recurse(config.commands, []) as ParseTree<C>

// 	return {
// 		tree,
// 		command,
// 		help: false,
// 	} as ParseResult<C>
// }

// function isCommandMatching(args: string[], path: string[]) {
// 	return path.every((part, index) => part === args[index])
// }

// const truisms = ["true", "yes", "on"]

// function analyzeCommand(
// 		path: string[],
// 		command: Command,
// 		ez: Parsed,
// 	): ParseCommand<Command> {

// 	const args = Object.fromEntries(command.args.map((argspec, index) => {
// 		const string = ez.args.at(index)
// 		if (argspec.mode === Mode.Required && string === undefined)
// 			throw new Error(`required argument "${argspec.name}"`)
// 		else
// 			return [
// 				argspec.name,
// 				convertPrimitive(argspec.primitive, string, argspec.fallback),
// 			]
// 	}))

// 	const params: Record<string, any> = Object.fromEntries(
// 		Object.entries(command.params).map(([key, paramspec]) => {
// 			const string = ez.params.get(key)
// 				?? ((paramspec.flag && ez.flags.has(paramspec.flag))
// 					? "true"
// 					: undefined
// 				)
// 			if (paramspec.mode === Mode.Required && string === undefined)
// 				throw new Error(`required parameter "--${key}" or "-${paramspec.flag}"`)
// 			else
// 				return [
// 					key,
// 					convertPrimitive(paramspec.primitive, string, paramspec.fallback),
// 				]
// 		})
// 	)

// 	return {
// 		path,
// 		args,
// 		params,
// 		help: command.help,
// 		extras: (ez.args.length > command.args.length)
// 			? ez.args.slice(command.args.length)
// 			: [],
// 	}
// }

// function convertPrimitive(primitive: Primitive, input: string | undefined, fallback: any) {
// 		if (primitive === Number)
// 			return (input === undefined)
// 				? fallback
// 				: Number(input)

// 		else if (primitive === Boolean)
// 			return (input === undefined)
// 				? fallback
// 				: truisms.some(s => s === input.toLowerCase())

// 		else
// 			return input ?? fallback
// }

