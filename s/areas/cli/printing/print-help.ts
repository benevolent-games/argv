
import {themes} from "../themes.js"
import {helpWiz} from "./help-wiz.js"
import {CliConfig} from "../types.js"
import {tnConnect, tnIndent} from "../../../tooling/text/tn.js"
import {SelectedCommand} from "../../analysis/types/analysis.js"
import {Command, CommandTree} from "../../analysis/types/commands.js"
import {Cmd, listAllCommands} from "../../analysis/utils/list-all-commands.js"

export function printHelp({
		readme,
		commands,
		selectedCommand,
		relevantCommands,
		name: programName,
		help: programHelp,
		summarize = true,
		theme = themes.standard,
	}: {
		commands: CommandTree
		selectedCommand: SelectedCommand | undefined
		relevantCommands: Cmd[]
	} & CliConfig<CommandTree>) {

	const wiz = helpWiz(theme)
	const commandList = listAllCommands(commands)
	const singleRootCommand = commands instanceof Command

	// this cli has one single command
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

	// user is asking for help about one specific command
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
		return tnConnect("\n\n", [
			tnConnect("\n", [
				wiz.programHeadline(programName, relevantCommands),
				tnIndent(1, wiz.programHelp(programHelp))
			]),
			...relevantCommands
				.map(cmd => tnIndent(1, tnConnect("\n\n", [
					tnConnect("\n", [
						wiz.commandHeadline(programName, cmd, summarize),
						tnIndent(1, wiz.commandHelp(cmd.command)),
					]),
					summarize
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
		const onlyOneCommand = relevantCommands.length === 1
		const actuallySummarize = summarize && !onlyOneCommand
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

