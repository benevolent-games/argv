
import {Command} from "../types/commands.js"
import {Parsed} from "../../parsing/types.js"
import {CommandAnalysis} from "../types/analysis.js"
import {MistakeError} from "../../../errors/basic.js"

export function analyzeCommand(
		path: string[],
		command: Command,
		parsed: Parsed,
	): CommandAnalysis<Command> {

	function handleError<T>(subject: string, name: string, fn: () => T) {
		try { return fn() }
		catch (error) {
			const message = (error instanceof Error)
				? error.message
				: "unknown error"
			throw new MistakeError(`${subject} ${name} ${message}`)
		}
	}

	const args = Object.fromEntries(
		command.args.map((arg, index) => {
			const input = parsed.args.at(index)
			return handleError("arg", `"${arg.name}"`, () =>
				[arg.name, arg.ingest(input)]
			)
		})
	)

	const params = Object.fromEntries(
		Object.entries(command.params)
			.map(([name, param]) => {
				if (param.flag && parsed.flags.has(param.flag))
					return [name, true]
				const input = parsed.params.get(name)
				return handleError("param", `--${name}`, () =>
					[name, param.ingest(input)]
				)
			})
	)

	const extraArgs = (parsed.args.length > command.args.length)
		? parsed.args.slice(command.args.length)
		: []

	return {path, args, params, extraArgs}
}

