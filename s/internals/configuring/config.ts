
import {Settings} from "./settings.js"
import {Environment} from "./environment.js"
import {Commands} from "../commanding/commands.js"
import {CommandSetup} from "../commanding/command-setup.js"

import {Command} from "../commanding/command.js"
import {asCommand} from "../commanding/as-command.js"
import {Group} from "../fielding/group.js"

export type Config<C extends Commands> = Environment & Settings & {
	commands: CommandSetup<C>
}

// TODO experimenting with types

function lol1<C extends Command<any, any>>(c: C) {}
function lol2<C>(c: C) {}
function lol3<C extends Command<Group, Group>>(c: C) {}
function lol4<FA extends Group, FP extends Group>(c: Command<FA, FP>) {}

;lol3(asCommand({
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

// export function setup<C extends Commands>(commands: CommandSetup<C>) {}

// setup(command => command({
// 		argorder: ["alpha"],
// 		args: {
// 			alpha: {
// 				type: String,
// 				mode: "requirement",
// 			},
// 		},
// 		params: {},
// 		async execute({args}) {
// 			args.alpha
// 		},
// }))

// export function asConfig<xConfig extends Config<Commands>>(c: xConfig) {
// 	return c
// }

// asConfig({
// 	name: "example",
// 	columns: 72,
// 	logger: new DisabledLogger(),
// 	exit: false,
// 	argv: ["bin", "script.js"],
// 	commands: command => asCommand({
// 		argorder: ["alpha"],
// 		args: {
// 			alpha: {
// 				type: String,
// 				mode: "requirement",
// 			},
// 		},
// 		params: {},
// 		async execute({args}) {
// 			args.alpha
// 		},
// 	}),
// })

// function lmao<C extends Command<Group, Group>>(c: C) {}
// function lmao2<FA extends Group, FP extends Group>(c: Command<FA, FP>) {}

// lmao2({
// 	argorder: ["alpha"],
// 	args: {
// 		alpha: {
// 			type: String,
// 			mode: "requirement",
// 		},
// 	},
// 	params: {},
// 	async execute({args}) {
// 		args.alpha
// 	},
// })

// const g = {
// 	lol: {
// 		type: String,
// 		mode: "requirement",
// 	},
// } satisfies Group

// let v: ValuesFromGroup<typeof g> = <any>undefined

// v.lol

// let c = {
// 	argorder: ["alpha"],
// 	args: {
// 		alpha: {
// 			type: String,
// 			mode: "requirement",
// 		},
// 	},
// 	params: {},
// 	async execute({args}) {
// 		args.alpha
// 	},
// } as Command<Group, Group>

// const lol = asCommand({
// 	argorder: ["alpha"],
// 	args: {
// 		alpha: {
// 			type: String,
// 			mode: "requirement",
// 		},
// 	},
// 	params: {},
// 	async execute({args}) {
// 		args.alpha
// 	},
// })

// asConfig({
// 	name: "example",
// 	columns: 72,
// 	logger: new DisabledLogger(),
// 	exit: false,
// 	argv: ["bin", "script.js"],
// 	commands: command => ({
// 		lol: command({
// 			argorder: ["alpha"],
// 			args: {
// 				alpha: {
// 					type: String,
// 					mode: "requirement",
// 				},
// 			},
// 			params: {
// 				rofl: {
// 					type: Number,
// 					mode: "requirement",
// 				},
// 			},
// 			async execute({args, params}) {
// 				args.alpha
// 				params.rofl
// 			},
// 		})
// 	}),
// })
