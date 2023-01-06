
import {Argspec} from "./argspec.js"
import {Paramspec} from "./paramspec.js"

export interface Spec<A extends Argspec, P extends Paramspec> {
	argv: string[]
	argorder: (keyof A)[]
	args: A
	params: P
}
