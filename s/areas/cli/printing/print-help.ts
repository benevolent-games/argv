
import {ArgvTheme, themes} from "../themes.js"
import {helpWiz} from "./help-wiz.js"
import {CliConfig} from "../types.js"
import {tnConnect, tnIndent} from "../../../tooling/text/tn.js"
import {SelectedCommand} from "../../analysis/types/analysis.js"
import {Command, CommandTree} from "../../analysis/types/commands.js"
import {Cmd, listAllCommands} from "../../analysis/utils/list-all-commands.js"
import { Palette } from "../../../tooling/text/coloring.js"

export function printHelp({
		readme,
		palette,
		commands,
		selectedCommand,
		relevantCommands,
		name: programName,
		help: programHelp,
		summarize = true,
	}: {
		commands: CommandTree
		relevantCommands: Cmd[]
		palette: Palette<ArgvTheme>
		selectedCommand: SelectedCommand | undefined
	} & CliConfig<CommandTree>) {

	const wiz = helpWiz(palette)
	const commandList = listAllCommands(commands)
	const singleRootCommand = commands instanceof Command

	// this cli has one root command
	if (singleRootCommand) {
		const selectedCommand = commandList[0]
		const {command} = selectedCommand
		return tnConnect("\n\n", [
			tnConnect("\n", [
				wiz.commandHeadline(programName, selectedCommand, false),
				tnIndent(1, tnConnect("\n", [
					wiz.programHelp(programHelp, readme),
					wiz.commandHelp(command),
				])),
			]),
			tnIndent(1, tnConnect("\n\n", [
				wiz.commandArgs(command.args),
				wiz.commandParams(command.params),
			])),
		])
	}

	// user asks about one specific command
	else if (selectedCommand) {
		const {command} = selectedCommand
		return tnConnect("\n\n", [
			tnConnect("\n", [
				wiz.commandHeadline(programName, selectedCommand, false),
				tnIndent(1, wiz.commandHelp(command)),
			]),
			tnIndent(1, tnConnect("\n\n", [
				wiz.commandArgs(command.args),
				wiz.commandParams(command.params),
			]))
		])
	}

	// help home page, multiple commands are available
	else if (relevantCommands.length === commandList.length) {
		const actuallySummarize = summarize && relevantCommands.length > 1
		return tnConnect("\n\n", [
			tnConnect("\n", [
				wiz.programHeadline(programName, relevantCommands),
				tnIndent(1, wiz.programHelp(programHelp))
			]),
			...relevantCommands
				.map(cmd => tnIndent(1, tnConnect("\n\n", [
					tnConnect("\n", [
						wiz.commandHeadline(programName, cmd, actuallySummarize),
						tnIndent(1, wiz.commandHelp(cmd.command)),
					]),
					actuallySummarize
						? null
						: tnIndent(1, tnConnect("\n\n", [
							wiz.commandArgs(cmd.command.args),
							wiz.commandParams(cmd.command.params),
						])),
				])))
		])
	}

	// a subset of commands
	else {
		const actuallySummarize = summarize && relevantCommands.length > 1
		return tnConnect("\n\n", relevantCommands
			.map(cmd => tnConnect("\n\n", [
				tnConnect("\n", [
					wiz.commandHeadline(programName, cmd, actuallySummarize),
					tnIndent(1, wiz.commandHelp(cmd.command)),
				]),
				actuallySummarize
					? null
					: tnIndent(1, tnConnect("\n\n", [
						wiz.commandArgs(cmd.command.args),
						wiz.commandParams(cmd.command.params),
					])),
			]))
		)
	}
}

