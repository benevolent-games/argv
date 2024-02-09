
/*

const prog = cli({
	program: "@benev/toolbox",
	help: `toolbox functions.`,
	commands: {
		pack: command(
			`optimize a glb.`,
			args(
				arg.required("inpath", String, `path to input glb.`),
				arg.required("outdir", String, `directory to output packed glbs into.`),
			),
			params({
				verbose: param.option(Number, `show more elaborate output.`),
			}),
		),
	},
})

*/

type Primitive = typeof Boolean | typeof Number | typeof String

type Typify<P extends Primitive> = (
	P extends typeof Boolean ? boolean
	: P extends typeof Number ? number
	: P extends typeof String ? string
	: never
)

export class Arg<R extends boolean, N extends string, P extends Primitive> {
	constructor(
		public required: R,
		public name: N,
		public primitive: P,
		public help: string,
	) {}
}

export class Param<R extends boolean> {
	constructor(
		public required: R,
		public primitive: Primitive,
		public help: string,
	) {}
}

export class Command<
		A extends Arg<boolean, string, Primitive>[],
		P extends Record<string, Param<boolean>>
	> {
	constructor(
		public help: string,
		public args: A,
		public params: P,
	) {}
}

function arg<R extends boolean, N extends string, P extends Primitive>(
		required: R,
		name: N,
		primitive: P,
		help: string,
	): Arg<R, N, P> {
	return new Arg<R, N, P>(required, name, primitive, help)
}

const required = true as const
const optional = false as const

function args<Args extends Arg<boolean, string, Primitive>[]>(...a: Args): Args {
	return a
}

function command<A extends Arg<boolean, string, Primitive>[], P extends Record<string, Param<boolean>>>(
		help: string,
		args: A,
		params: P,
	): Command<A, P> {
	return new Command(help, args, params)
}

export type CommandTree = Command<any, any> | Record<string, Command<any, any>>

export type CliConfig<C extends CommandTree> = {
	program: string
	help: string
	commands: C
}

type Argify<T extends Arg<boolean, string, Primitive>[]> = {
	[P in T[number]["name"]
		as Extract<T[number], {name: P}> extends {required: true} ? P : never]:
			Typify<Extract<T[number], { name: P }>["primitive"]>
} & {
	[P in T[number]["name"]
		as Extract<T[number], {name: P}> extends {required: false} ? P : never]?:
			Typify<Extract<T[number], {name: P}>["primitive"]>
}

export type CliResult<C extends CommandTree> = C extends Command<any, any>
	? {
		help: string
		args: Argify<C["args"]>
	}
	: C extends Record<string, Command<any, any>>
		? {[K in keyof C]: CliResult<C[K]>}
		: never

export function cli<C extends CommandTree>({}: CliConfig<C>) {
	return undefined as any as CliResult<C>
}

const result = cli({
	program: "@benev/toolbox",
	help: `toolbox functions.`,
	commands: {
		pack: command(
			`optimize a glb.`,
			args(
				arg(required, "inpath", Boolean, `path to input glb.`),
				arg(optional, "outdir", String, `directory to output packed glbs into.`),
			),
			{},
			// params({
			// 	verbose: param.option(Number, `show more elaborate output.`),
			// }),
		),
	},
})

result.pack.args.inpath
result.pack.args.outdir

const result2 = cli({
	program: "@benev/toolbox",
	help: `toolbox functions.`,
	commands: command(
		`optimize a glb.`,
		args(
			arg(required, "inpath", Boolean, `path to input glb.`),
			arg(optional, "outdir", String, `directory to output packed glbs into.`),
		),
		{},
		// params({
		// 	verbose: param.option(Number, `show more elaborate output.`),
		// }),
	),
})

result2.args.inpath







// older sketch below

// type Primitive = typeof Boolean | typeof Number | typeof String
// type Typify<P extends Primitive> = (
// 	P extends typeof Boolean ? boolean
// 	: P extends typeof Number ? number
// 	: P extends typeof String ? string
// 	: never
// )

// type Arg<T extends Primitive> = { key: string; type: T; help: string };
// type Option<T extends Primitive> = { type: T; help: string };

// function arg<K extends string, T extends Primitive>(
// 		key: K,
// 		type: T,
// 		help: string,
// 	): Arg<T> {
// 	return {key, type, help}
// }

// function option<T extends Primitive>(type: T, help: string): Option<T> {
// 	return {type, help}
// }

// type CommandConfig<
// 		Args extends Arg<Primitive>[],
// 		Params extends Record<string, Option<Primitive>>
// 	> = {
// 	help: string
// 	args: Args
// 	params: Params
// }

// type Cmd<
// 		Args extends Arg<Primitive>[],
// 		Params extends Record<string, Option<Primitive>>
// 	> = {
// 	args: {[P in keyof Args]: Typify<Args[P]["type"]>}
// 	params: {[P in keyof Params]: Typify<Params[P]["type"]>}
// }

// type Api<Commands = {}> = {
// 	command<
// 		K extends string,
// 		Args extends Arg<Primitive>[],
// 		Params extends Record<string, Option<Primitive>>
// 		>(
// 		name: K,
// 		config: CommandConfig<Args, Params>,
// 	): Api<Commands & Record<K, CommandConfig<Args, Params>>>
// 	done(): Commands
// }

// function cli<T = {}>(program: string) {
// 	let help = ""
// 	const commands: any = {}

// 	const api = {
// 		command<
// 				K extends string,
// 				Args extends Arg<Primitive>[],
// 				Params extends Record<string, Option<Primitive>>
// 			>(name: K, config: CommandConfig<Args, Params>): Api<T & Record<K, Cmd<Args, Params>>> {
// 			commands[name] = config
// 			return api as Api<T & Record<K, Cmd<Args, Params>>>
// 		},
// 		done() {
// 			return commands as T
// 		},
// 	}

// 	return {
// 		help(helpText: string) {
// 			help = helpText
// 			return api
// 		},
// 	}
// }

// function tuple<T extends any[]>(...elements: T): T {
// 	return elements;
// }

// const prog = cli("@benev/toolbox pack")
// 	.help("lol")

// 	.command("pack", {
// 		help: `optimize a glb.`,
// 		args: tuple(
// 			arg("inpath", String, `path to input glb.`),
// 			arg("outdir", String, `directory to output packed glbs into.`),
// 			arg("count", Number, `directory to output packed glbs into.`),
// 		),
// 		params: {
// 			verbose: option(Number, `show more elaborate output.`),
// 		},
// 	})

// 	.command("inspect", {
// 		help: `investigate the contents of a glb.`,
// 		args: [
// 			arg("inpath", String, `path to input glb.`),
// 		],
// 		params: {},
// 	})

// 	.done()

// const [inpath, outdir, count] = prog.pack.args


