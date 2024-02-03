
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

// older sketch below

type Primitive = typeof Boolean | typeof Number | typeof String
type Typify<P extends Primitive> = (
	P extends typeof Boolean ? boolean
	: P extends typeof Number ? number
	: P extends typeof String ? string
	: never
)

type Arg<T extends Primitive> = { key: string; type: T; help: string };
type Option<T extends Primitive> = { type: T; help: string };

function arg<K extends string, T extends Primitive>(
		key: K,
		type: T,
		help: string,
	): Arg<T> {
	return {key, type, help}
}

function option<T extends Primitive>(type: T, help: string): Option<T> {
	return {type, help}
}

type CommandConfig<
		Args extends Arg<Primitive>[],
		Params extends Record<string, Option<Primitive>>
	> = {
	help: string
	args: Args
	params: Params
}

type Cmd<
		Args extends Arg<Primitive>[],
		Params extends Record<string, Option<Primitive>>
	> = {
	args: {[P in keyof Args]: Typify<Args[P]["type"]>}
	params: {[P in keyof Params]: Typify<Params[P]["type"]>}
}

type Api<Commands = {}> = {
	command<
		K extends string,
		Args extends Arg<Primitive>[],
		Params extends Record<string, Option<Primitive>>
		>(
		name: K,
		config: CommandConfig<Args, Params>,
	): Api<Commands & Record<K, CommandConfig<Args, Params>>>
	done(): Commands
}

function cli<T = {}>(program: string) {
	let help = ""
	const commands: any = {}

	const api = {
		command<
				K extends string,
				Args extends Arg<Primitive>[],
				Params extends Record<string, Option<Primitive>>
			>(name: K, config: CommandConfig<Args, Params>): Api<T & Record<K, Cmd<Args, Params>>> {
			commands[name] = config
			return api as Api<T & Record<K, Cmd<Args, Params>>>
		},
		done() {
			return commands as T
		},
	}

	return {
		help(helpText: string) {
			help = helpText
			return api
		},
	}
}

function tuple<T extends any[]>(...elements: T): T {
	return elements;
}

const prog = cli("@benev/toolbox pack")
	.help("lol")

	.command("pack", {
		help: `optimize a glb.`,
		args: tuple(
			arg("inpath", String, `path to input glb.`),
			arg("outdir", String, `directory to output packed glbs into.`),
			arg("count", Number, `directory to output packed glbs into.`),
		),
		params: {
			verbose: option(Number, `show more elaborate output.`),
		},
	})

	.command("inspect", {
		help: `investigate the contents of a glb.`,
		args: [
			arg("inpath", String, `path to input glb.`),
		],
		params: {},
	})

	.done()

const [inpath, outdir, count] = prog.pack.args


