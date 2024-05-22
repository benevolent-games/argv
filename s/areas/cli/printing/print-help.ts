
import {themes} from "../themes.js"
import {helpWiz} from "./help-wiz.js"
import {CliConfig} from "../types.js"
import {tnConnect, tnIndent} from "../../../tooling/text/tn.js"
import {SelectedCommand} from "../../analysis/types/analysis.js"
import {Command, CommandTree} from "../../analysis/types/commands.js"
import {listAllCommands} from "../../analysis/utils/list-all-commands.js"

export function printHelp({
		readme,
		commands,
		selectedCommand,
		name: programName,
		help: programHelp,
		theme = themes.standard,
	}: {
		commands: CommandTree
		selectedCommand: SelectedCommand | undefined
	} & CliConfig<CommandTree>) {

	const wiz = helpWiz(theme)
	const commandList = listAllCommands(commands)
	const singleRootCommand = commands instanceof Command

	// general help, this cli has one single command
	if (singleRootCommand) {
		const selectedCommand = commandList[0]
		const {command} = selectedCommand
		return tnConnect("\n\n", [
			tnConnect("\n", [
				wiz.commandHeadline(programName, selectedCommand),
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

	// user is asking for help about a specific command
	else if (selectedCommand) {
		const {command} = selectedCommand
		return tnConnect("\n\n", [
			tnConnect("\n", [
				wiz.commandHeadline(programName, selectedCommand),
				tnIndent(1, wiz.commandHelp(command)),
			]),
			tnIndent(1, tnConnect("\n", [
				wiz.commandArgs(command.args),
				wiz.commandParams(command.params),
			]))
		])
	}

	// general help, this cli has multiple commands
	else {
		return tnConnect("\n\n", [
			tnConnect("\n", [
				wiz.programHeadline(programName, commandList),
				tnIndent(1, wiz.programHelp(programHelp))
			]),
			...commandList
				.map(cmd => tnIndent(1, tnConnect("\n\n", [
					tnConnect("\n", [
						wiz.commandHeadline(programName, cmd),
						tnIndent(1, wiz.commandHelp(cmd.command)),
					]),
					tnIndent(1, tnConnect("\n\n", [
						wiz.commandArgs(cmd.command.args),
						wiz.commandParams(cmd.command.params),
					])),
				])))
		])
	}
}

