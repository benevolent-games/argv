
export type AnalysisConfig<C extends CommandTree> = {
	argv: string[]
	commands: C
}

//////////////////////

export type CommandTree = Command | {[key: string]: Command | CommandTree}

export class Command<
		A extends Arg<string, Primitive>[] = Arg<string, Primitive>[],
		P extends Record<string, Param<Primitive>> = Record<string, Param<Primitive>>,
	> {

	static create<
			A extends Arg<string, Primitive>[],
			P extends Record<string, Param<Primitive>>,
		>({help, args, params}: {
			help: string | undefined,
			args: A,
			params: P,
		}) {
		return new this<A, P>(help, args, params)
	}

	constructor(
		public help: string | undefined,
		public args: A,
		public params: P,
	) {}
}

//////////////////////

export type Primitive = typeof Boolean | typeof Number | typeof String

export type Typify<P extends Primitive> = (
	P extends typeof Boolean ? boolean
	: P extends typeof Number ? number
	: P extends typeof String ? string
	: never
)

export type Arg<N extends string, P extends Primitive> = (
	ArgRequired<N, P> | ArgOptional<N, P> | ArgDefault<N, P>
)

export type ArgBase<N extends string, P extends Primitive> = {
	name: N
	primitive: P
	help: string
}

export type ArgRequired<N extends string, P extends Primitive> = {
	mode: "required"
} & ArgBase<N, P>

export type ArgOptional<N extends string, P extends Primitive> = {
	mode: "optional"
} & ArgBase<N, P>

export type ArgDefault<N extends string, P extends Primitive> = {
	mode: "default"
	fallback: Typify<P>
} & ArgBase<N, P>

//////////////////////

export type Param<P extends Primitive> = (
	ParamRequired<P> | ParamOptional<P> | ParamDefault<P> | ParamFlag
)

export type ParamBase<P extends Primitive> = {
	primitive: P
	help: string
}

export type ParamRequired<P extends Primitive> = {
	mode: "required"
} & ParamBase<P>

export type ParamOptional<P extends Primitive> = {
	mode: "optional"
} & ParamBase<P>

export type ParamDefault<P extends Primitive> = {
	mode: "default"
	fallback: Typify<P>
} & ParamBase<P>

export type ParamFlag = {
	mode: "flag"
	flag: string
	fallback: false
} & ParamBase<typeof Boolean>

////////////////////////////////////////

export type Argify<A extends Arg<string, Primitive>[]> = {
	[K in A[number]["name"]
		as Extract<A[number], {name: K}> extends {mode: "required" | "default"} ? K : never]:
			Typify<Extract<A[number], {name: K}>["primitive"]>
} & {
	[K in A[number]["name"]
		as Extract<A[number], {name: K}> extends {mode: "optional"} ? K : never]?:
			Typify<Extract<A[number], {name: K}>["primitive"]>
}

export type Paramify<Params extends Record<string, Param<Primitive>>> = {
	[K in keyof Params
		as Params[K]["mode"] extends ("required" | "default") ? K : never]:
			Typify<Params[K]["primitive"]>;
} & Partial<{
	[K in keyof Params
		as Params[K]["mode"] extends "optional" ? K : never]:
			Typify<Params[K]["primitive"]>;
}>

export type CommandAnalysis<C extends Command<any, any>> = {
	path: string[]
	help: string | undefined
	args: Argify<C["args"]>
	params: Paramify<C["params"]>
	extras: string[]
}

export type TreeAnalysis<C extends CommandTree> = (
	C extends Command<any, any>
		? CommandAnalysis<C>
		: C extends Record<string, Command<any, any>>
			? {[K in keyof C]?: TreeAnalysis<C[K]>}
			: never
)

export type Analysis<C extends CommandTree> = {
	help: boolean
	tree: TreeAnalysis<C>
	command: CommandAnalysis<Command> | undefined
}

//////////////////////

export const arg = {
	required: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {help: string},
		): ArgRequired<N, P> => ({
		...o,
		mode: "required",
		name,
		primitive,
	}),

	optional: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {help: string, fallback: Typify<P>},
		): ArgOptional<N, P> => ({
		...o,
		mode: "optional",
		name,
		primitive,
	}),

	default: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {help: string, fallback: Typify<P>},
		): ArgDefault<N, P> => ({
		...o,
		mode: "default",
		name,
		primitive,
	}),
}

export const param = {
	required: <P extends Primitive>(
			primitive: P,
			o: {help: string},
		): ParamRequired<P> => ({
		...o,
		mode: "required",
		primitive,
	}),

	optional: <P extends Primitive>(
			primitive: P,
			o: {fallback: Typify<P>, help: string},
		): ParamOptional<P> => ({
		...o,
		mode: "optional",
		primitive,
	}),

	default: <P extends Primitive>(
			primitive: P,
			o: {fallback: Typify<P>, help: string},
		): ParamDefault<P> => ({
		...o,
		mode: "default",
		primitive,
	}),

	flag: (
			o: {flag: string, help: string},
		): ParamFlag => ({
		...o,
		mode: "flag",
		primitive: Boolean,
		fallback: false,
	}),
}

/////////////////////////////////////////

// const lol = Command.create({
// 	help: `lol`,
// 	args: [
// 		arg.optional("lmao", String, {
// 			fallback: "refl",
// 			help: `asdasd`,
// 		}),
// 		arg.required("danger", String, {
// 			help: `asdasd`,
// 		}),
// 		arg.default("qwe", Number, {
// 			fallback: 234,
// 			help: `qweqwe`,
// 		})
// 	],
// 	params: {
// 		alpha: param.default(Number, {
// 			help: `alphalpha`,
// 			fallback: 123,
// 		}),
// 	},
// })

// const a: TreeAnalysis<typeof lol> = undefined as any
// a.params.alpha
// a.args.qwe

