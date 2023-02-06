
import {Settings} from "./settings.js"
import {Environment} from "./environment.js"
import {Commands} from "../commanding/commands.js"
import {CommandSetup} from "../commanding/command-setup.js"

import {DisabledLogger} from "../tooling/logger.js"
import {asCommand} from "../commanding/as-command.js"

export type Config<C extends Commands> = Environment & Settings & {
	commands: CommandSetup<C>
}

// TODO experimenting with types

export function setup<C extends Commands>(commands: CommandSetup<C>) {}

setup(command => command({
		argorder: ["alpha"],
		args: {
			alpha: {
				type: String,
				mode: "requirement",
			},
		},
		params: {},
		async execute({args}) {
			args.alpha
		},
}))

export function asConfig<xConfig extends Config<Commands>>(c: xConfig) {
	return c
}

asConfig({
	name: "example",
	columns: 72,
	logger: new DisabledLogger(),
	exit: false,
	argv: ["bin", "script.js"],
	commands: command => asCommand({
		argorder: ["alpha"],
		args: {
			alpha: {
				type: String,
				mode: "requirement",
			},
		},
		params: {},
		async execute({args}) {
			args.alpha
		},
	}),
})

const lol = asCommand({
	argorder: ["alpha"],
	args: {
		alpha: {
			type: String,
			mode: "requirement",
		},
	},
	params: {},
	async execute({args}) {
		args.alpha
	},
})

asConfig({
	name: "example",
	columns: 72,
	logger: new DisabledLogger(),
	exit: false,
	argv: ["bin", "script.js"],
	commands: command => ({
		lol: command({
			argorder: ["alpha"],
			args: {
				alpha: {
					type: String,
					mode: "requirement",
				},
			},
			params: {},
			async execute({args}) {
				args.alpha
			},
		})
	}),
})
