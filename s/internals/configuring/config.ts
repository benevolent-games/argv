
import {Settings} from "./settings.js"
import {Environment} from "./environment.js"
import {Commands} from "../commanding/commands.js"
import {CommandSetup} from "../commanding/command-setup.js"

export type Config<C extends Commands> = Environment & Settings & {
	commands: CommandSetup<C>
}

export function asConfig<xConfig extends Config<Commands>>(c: xConfig) {
	return c
}

asConfig({
	name: "example",
	columns: 72,
	logger: new DisabledLogger(),
	exit: false,
	argv: ["bin", "script.js"],
	commands: command => command({
		argorder: ["alpha"],
		args: {
			alpha: {
				type: String,
				mode: "requirement",
			},
		},
		params: {},
		async execute() {},
	}),
})
