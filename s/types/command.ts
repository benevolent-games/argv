
import {Argspec} from "./argspec.js"
import {Paramspec} from "./paramspec.js"
import {TypeToValue} from "./type-to-value.js"

export interface Command<A extends Argspec, P extends Paramspec> {
	executable: string
	module: string
	args: {[X in keyof A]?: TypeToValue<A[X]>}
	params: {[X in keyof P]?: TypeToValue<P[X]>}
}
