
import {Arg} from "./args.js"
import {Param} from "./params.js"
import {Primitive, Typify} from "./primitives.js"
import {Command, CommandTree} from "./commands.js"

export type AnalysisConfig<C extends CommandTree> = {
	argv: string[]
	commands: C
}

export type ArgsAnalysis<A extends Arg<string, Primitive>[]> = {
	[K in A[number]["name"]
		as Extract<A[number], {name: K}> extends {mode: "required" | "default"} ? K : never]:
			Typify<Extract<A[number], {name: K}>["primitive"]>
} & {
	[K in A[number]["name"]
		as Extract<A[number], {name: K}> extends {mode: "optional"} ? K : never]?:
			Typify<Extract<A[number], {name: K}>["primitive"]>
}

export type ParamAnalysis<Params extends Record<string, Param<Primitive>>> = {
	[K in keyof Params
		as Params[K]["mode"] extends ("required" | "default") ? K : never]:
			Typify<Params[K]["primitive"]>;
} & Partial<{
	[K in keyof Params
		as Params[K]["mode"] extends "optional" ? K : never]:
			Typify<Params[K]["primitive"]>;
}>

export type CommandAnalysis<C extends Command> = {
	path: string[]
	help: string | undefined
	args: ArgsAnalysis<C["args"]>
	params: ParamAnalysis<C["params"]>
	extraArgs: string[]
	execute: () => Promise<void> | undefined
}

export type TreeAnalysis<C extends CommandTree> = (
	C extends Command
		? CommandAnalysis<C>
		: C extends {[key: string]: Command | CommandTree}
			? {[K in keyof C]?: TreeAnalysis<C[K]>}
			: never
)

export type Analysis<C extends CommandTree> = {
	tree: TreeAnalysis<C>
	command: CommandAnalysis<Command> | undefined
}

