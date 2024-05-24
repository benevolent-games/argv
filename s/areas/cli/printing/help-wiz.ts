
import {ArgvTheme} from "../themes.js"
import {Palette} from "../../../tooling/text/theming.js"
import {Command} from "../../analysis/types/commands.js"
import {Args, Params} from "../../analysis/types/units.js"
import {Cmd} from "../../analysis/utils/list-all-commands.js"
import {normalize} from "../../../tooling/text/formatting.js"
import {tnConnect, tnIndent} from "../../../tooling/text/tn.js"

export function helpWiz(palette: Palette<ArgvTheme>) {

	function commandHeadline(
			programName: string,
			{command, path}: Cmd,
			summarize: boolean,
		) {
		return tnConnect(" ", [

			// program name
			palette.program(programName),

			// command
			(path.length > 0)
				&& tnConnect(" ", path.map(palette.command)),

			// args
			command.args
				.map(arg => arg.name)
				.map(n => palette.arg(`${n}`))
				.join(" "),

			// params
			summarize
				? palette.param(`--help`)
				: Object.keys(command.params).length === 0
					? null
					: palette.param(`{params}`),
		])
	}

	function commandHelp(command: Command) {
		return command.help
			&& palette.plain(normalize(command.help))
	}

	function commandArgs(args: Args) {
		return tnConnect("\n\n", args.map(arg => tnConnect("\n", [

			// arg header
			tnConnect(" ", [

				// arg name
				palette.arg(arg.name + ","),

				// arg mode
				arg.mode === "required"
					? palette.required(arg.mode)
					: palette.mode(arg.mode),

				// arg primitive
				palette.type(arg.type),

				// arg fallback
				arg.mode === "default"
					&& palette.value(JSON.stringify(arg.fallback)),
			]),

			// arg help
			arg.help
				&& tnIndent(1, palette.plain(normalize(arg.help))),
		])))
	}

	function commandParams(params: Params) {
		return tnConnect("\n\n", Object.entries(params)
			.map(([name, param]) => tnConnect("\n", [

				// param header
				tnConnect(" ", [

					// param name
					palette.param(`--${name},`),

					// param flag
					param.mode === "flag"
						&& palette.flag(`-${param.flag},`),

					// param mode
					param.mode === "required"
						? palette.required(param.mode)
						: palette.mode(param.mode),

					// param primitive
					palette.type(param.type),

					// param default
					param.mode === "default"
						&& palette.value(`${param.fallback}`),
				]),

				// param help
				param.help
					&& tnIndent(1, palette.plain(normalize(param.help))),
			]))
		)
	}

	function programHeadline(name: string, commandList: Cmd[]) {
		return tnConnect(" ", [
			palette.program(name),
			(commandList.length > 1)
				&& palette.command("<command>"),
		])
	}

	function programHelp(help?: string, readme?: string) {
		return tnConnect("\n", [
			readme && `${palette.property("readme")} ${palette.link(readme.trim())}`,
			help && palette.plain(normalize(help)),
		])
	}

	return {
		programHeadline,
		programHelp,
		commandHeadline,
		commandHelp,
		commandArgs,
		commandParams,
	}
}

