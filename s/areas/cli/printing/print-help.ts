
import {ArgvTheme} from "../themes.js"
import {helpWiz} from "./help-wiz.js"
import {CliConfig} from "../types.js"
import {Palette} from "../../../tooling/text/theming.js"
import {SelectedCommand} from "../../analysis/types/analysis.js"
import {Command, CommandTree} from "../../analysis/types/commands.js"
import {Cmd, listAllCommands} from "../../analysis/utils/list-all-commands.js"

import * as tn from "../../../tooling/text/tn.js"

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
		return tn.connect("\n\n", [
			tn.connect("\n", [
				wiz.commandHeadline(programName, selectedCommand, false),
				tn.indent(1, tn.connect("\n", [
					wiz.programHelp(programHelp, readme),
					wiz.commandHelp(command),
				])),
			]),
			tn.indent(1, tn.connect("\n\n", [
				wiz.commandArgs(command),
				wiz.commandParams(command.params),
			])),
		])
	}

	// user asks about one specific command
	else if (selectedCommand) {
		const {command} = selectedCommand
		return tn.connect("\n\n", [
			tn.connect("\n", [
				wiz.commandHeadline(programName, selectedCommand, false),
				tn.indent(1, wiz.commandHelp(command)),
			]),
			tn.indent(1, tn.connect("\n\n", [
				wiz.commandArgs(command),
				wiz.commandParams(command.params),
			]))
		])
	}

	// help home page, multiple commands are available
	else if (relevantCommands.length === commandList.length) {
		const actuallySummarize = summarize && relevantCommands.length > 1
		return tn.connect("\n\n", [
			tn.connect("\n", [
				wiz.programHeadline(programName, relevantCommands),
				tn.indent(1, wiz.programHelp(programHelp, readme))
			]),
			...relevantCommands
				.map(cmd => tn.indent(1, tn.connect("\n\n", [
					tn.connect("\n", [
						wiz.commandHeadline(programName, cmd, actuallySummarize),
						tn.indent(1, wiz.commandHelp(cmd.command)),
					]),
					actuallySummarize
						? null
						: tn.indent(1, tn.connect("\n\n", [
							wiz.commandArgs(cmd.command),
							wiz.commandParams(cmd.command.params),
						])),
				])))
		])
	}

	// a subset of commands
	else {
		const actuallySummarize = summarize && relevantCommands.length > 1
		return tn.connect("\n\n", relevantCommands
			.map(cmd => tn.connect("\n\n", [
				tn.connect("\n", [
					wiz.commandHeadline(programName, cmd, actuallySummarize),
					tn.indent(1, wiz.commandHelp(cmd.command)),
				]),
				actuallySummarize
					? null
					: tn.indent(1, tn.connect("\n\n", [
						wiz.commandArgs(cmd.command),
						wiz.commandParams(cmd.command.params),
					])),
			]))
		)
	}
}
