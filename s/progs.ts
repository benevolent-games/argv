
import {Field} from "./types/field.js"

export type Result<
		FA extends Field.Group,
		FP extends Field.Group,
	> = {
	args: Field.ValuesFromGroup<FA>
	params: Field.ValuesFromGroup<FP>
	cmd: string
	executable: string
	module: string
}

export type Command<
		FA extends Field.Group,
		FP extends Field.Group,
	> = {
	argorder: (keyof FA)[]
	args: FA
	params: FP
	execute: (result: Result<FA, FP>) => Promise<void>
}

export type CommandTree = {
	[key: string]: CommandTree | Command<any, any>
}

export type Commands = Command<any, any> | CommandTree

export const asCommand = <
	FA extends Field.Group,
	FP extends Field.Group,
>(c: Command<FA, FP>) => c

export type Config<C extends Commands> = {
	commands: (as: typeof asCommand) => C
}

export function program<C extends Commands>({}: {
	commands: (as: typeof asCommand) => C
}) {}

const c = asCommand({
	argorder: ["rofl"],
	args: {
		rofl: {
			type: String,
			mode: "requirement",
		},
	},
	params: {},
	async execute({args}) {
		args.rofl
	},
})

const example = program({
	commands: command => ({
		lol2: c,
		lol: asCommand({
			argorder: ["rofl"],
			args: {
				rofl: {
					type: String,
					mode: "requirement",
				},
			},
			params: {},
			async execute({args}) {
				args.rofl
			},
		})
	})
})
