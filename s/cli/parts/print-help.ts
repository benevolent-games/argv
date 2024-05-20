
import {themes} from "../themes.js"
import {CliConfig} from "../cli.js"
import {wrap} from "../../tooling/text/wrap.js"
import {Args} from "../../analysis/types/args.js"
import {undent} from "../../tooling/text/undent.js"
import {indent} from "../../tooling/text/indent.js"
import {Params} from "../../analysis/types/params.js"
import {CommandTree} from "../../analysis/analyze.js"
import {Command} from "../../analysis/types/commands.js"
import {textbrick} from "../../tooling/text/textbrick.js"
import {makePalette} from "../../tooling/text/coloring.js"
import {primitiveName} from "../../analysis/types/primitives.js"
import {SelectedCommand} from "../../analysis/types/analysis.js"

export function printHelp({
		columns,
		commands,
		selectedCommand,
		name: programName,
		help: programHelp,
		theme = themes.standard,
	}: {
		commands: CommandTree
		selectedCommand: SelectedCommand | undefined
	} & CliConfig<CommandTree>) {

	const glyph = "  "
	const p = makePalette(theme)
	const brick = (depth: number, text: string) => textbrick({
		text,
		indentation: {glyph, depth},
	})
	const tab = (depth: number, text: string) => indent({glyph, depth}, text)

	function printCommand({path, command}: {path: string[], command: Command}) {
		const name = [
			p.program(programName),
			(path.length > 0)
				? p.command(path.join(" "))
				: "",
		].filter(present).join(" ")
		const args = command.args
			.map(arg => arg.name).map(n => p.arg(`<${n}>`))
			.join(" ")
		const params = Object.keys(command.params).length === 0
			? null
			: p.param(`{params}`)
		const headline = [name, args, params].filter(nonvoid)
		return [
			[
				headline.join(" "),
				command.help
					? tab(1, undent(command.help))
					: null,
			].filter(nonvoid).join("\n"),
			tab(1, printArgs(command.args)),
			tab(1, printParams(command.params)),
		].filter(nonvoid).join("\n\n")
	}

	function printArgs(args: Args) {
		return args.map(arg => {
			const header = [
				p.arg(arg.name + ","),
				arg.mode === "required"
					? p.required(arg.mode)
					: p.mode(arg.mode),
				p.type(primitiveName(arg.primitive)),
				arg.mode === "default"
					? p.value(JSON.stringify(arg.fallback))
					: null,
			].filter(nonvoid).join(" ")
			return [
				header,
				arg.help
					? brick(1, arg.help)
					: null,
			].filter(nonvoid).join("\n")
		}).filter(nonvoid).join("\n\n")
	}

	function printParams(params: Params) {
		return Object.entries(params).map(([paramName, param]) => {
			const header = [
				p.param("--" + paramName + ","),
				param.mode === "flag"
					? p.flag("-" + param.flag + ",")
					: null,
				param.mode === "required"
					? p.required(param.mode)
					: p.mode(param.mode),
				p.type(primitiveName(param.primitive)),
				param.mode === "default"
					? p.value(`"${param.fallback.toString()}"`)
					: null,
			].filter(nonvoid).join(" ")
			return [
				header,
				param.help
					? brick(1, param.help)
					: null,
			].filter(nonvoid).join("\n")
		}).filter(nonvoid).join("\n\n")
	}

	const commandlist = listAllCommands(commands)

	const programHeader = [
		p.program(programName) + (
			(commandlist.length > 1)
				? " " + p.command("<command>")
				: ""
		),
		programHelp
			? brick(1, programHelp)
			: null,
	].join("\n")

	if (selectedCommand) {
		const {command, path} = selectedCommand
		return [
			programHeader,
			brick(1, printCommand({command, path})),
		].filter(nonvoid)
			.map(t => wrap(columns, t))
			.join("\n\n")

	}
	else {
		return [
			programHeader,
			tab(1, commandlist
				.map(printCommand)
				.map(t => brick(0, t))
				.join("\n\n")),
		].filter(nonvoid)
			.map(t => brick(0, t))
			.map(t => wrap(columns, t))
			.join("\n\n")
	}
}

/////////////////////////////////////////////////

function nonvoid<X>(x: X): x is NonNullable<X> {
	return x !== null && x !== undefined
}

function present(x: any) {
	return !!x
}

function listAllCommands(commands: CommandTree) {
	const commandlist: {path: string[], command: Command}[] = []
	function recurse(c: CommandTree, path: string[]): any {
		if (c instanceof Command)
			commandlist.push({path, command: c})
		else
			for (const [key, c2] of Object.entries(c))
				recurse(c2, [...path, key])
	}
	recurse(commands, [])
	return commandlist
}

