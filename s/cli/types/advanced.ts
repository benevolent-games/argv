
import {Arg, Command, CommandTree, Param, Primitive} from "./basic.js"

export type Typify<P extends Primitive> = (
	P extends typeof Boolean ? boolean
	: P extends typeof Number ? number
	: P extends typeof String ? string
	: never
)

export type Argify<T extends Arg<boolean, string, Primitive>[]> = {
	[P in T[number]["name"]
		as Extract<T[number], {name: P}> extends {required: true} ? P : never]:
			Typify<Extract<T[number], {name: P}>["primitive"]>
} & {
	[P in T[number]["name"]
		as Extract<T[number], {name: P}> extends {required: false} ? P : never]?:
			Typify<Extract<T[number], {name: P}>["primitive"]>
}

export type Paramify<T extends Record<string, Param<boolean, Primitive>>> = {
	[K in keyof T
		as T[K]["required"] extends true ? K : never]:
			Typify<T[K]["primitive"]>;
} & Partial<{
	[K in keyof T
		as T[K]["required"] extends false ? K : never]:
			Typify<T[K]["primitive"]>;
}>

export type CliResult<C extends CommandTree> = (
	C extends Command<any, any>
		? {
			help: string
			args: Argify<C["args"]>
			params: Paramify<C["params"]>
		}
		: C extends Record<string, Command<any, any>>
			? {[K in keyof C]: CliResult<C[K]>}
			: never
)

