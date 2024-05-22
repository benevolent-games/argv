
import {Arg} from "./args.js"
import {Param} from "./params.js"
import {Primitive, Typify} from "./primitives.js"
import {Command, CommandTree} from "./commands.js"

export type AnalyzeOptions<C extends CommandTree> = {
	commands: C,
	shorthandBooleans?: boolean
}

export type Analysis<C extends CommandTree> = {
	tree: TreeAnalysis<C>
	commandSpec: Command
	command: CommandAnalysis<Command>
	extraArgs: string[]
}

export type SelectedCommand = {
	argx: string[]
	path: string[]
	command: Command
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
		as Params[K]["mode"] extends ("optional" | "flag") ? K : never]:
			Typify<Params[K]["primitive"]>;
}>

export type CommandAnalysis<C extends Command<any, any>> = {
	path: string[]
	args: ArgsAnalysis<C["args"]>
	params: ParamAnalysis<C["params"]>
	extraArgs: string[]
}

export type TreeAnalysis<C extends CommandTree> = (
	NonNullable<TreeAnalysisWeak<C>>
)

type TreeAnalysisWeak<C extends CommandTree> = (
	C extends Command<any, any>
		? CommandAnalysis<C> | undefined
		: C extends {[key: string]: CommandTree}
			? {[K in keyof C]: TreeAnalysisWeak<C[K]>}
			: never
)

