
import {Command, CommandTree} from "./commands.js"
import {Args, DistillInput, Params} from "./sketch.js"

export type AnalyzeOptions<C extends CommandTree> = {
	commands: C,
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

export type DistillArgs<A extends Args> = {
	[I in A[number] as I["name"]]: DistillInput<I>
}

export type DistillParams<P extends Params> = {
	[K in keyof P]: DistillInput<P[K]>
}

export type CommandAnalysis<C extends Command<any, any>> = {
	path: string[]
	args: DistillArgs<C["args"]>
	params: DistillParams<C["params"]>
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

