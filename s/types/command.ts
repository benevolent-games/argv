
import {Argspec} from "./argspec.js"
import {Paramspec} from "./paramspec.js"
import {Primitive} from "./primitive.js"

export interface Command<A extends Argspec, P extends Paramspec> {
	executable: string
	module: string
	args: {[X in keyof A]?: Primitive<A[X]>}
	params: {[X in keyof P]?: Primitive<P[X]>}
}
