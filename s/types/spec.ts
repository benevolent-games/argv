
import {ZField} from "./field.js"
import {Values} from "./values.js"
import {Fields2} from "./fields.js"
import {Argspec} from "./argspec.js"
import {Paramspec} from "./paramspec.js"

export interface Spec5<
		FA extends ZField.Group = ZField.Group,
		FP extends ZField.Group = ZField.Group
	> {
	bin: string
	argv: string[]
	argorder: (keyof FA)[]
	args: FA
	params: FP
	readme?: string
	help?: string
	columns?: number
}

export interface Spec4<FA extends Fields2<Values>, FP extends Fields2<Values>> {
	argv: string[]
	argorder: (keyof FA)[]
	args: FA
	params: FP
	readme?: string
}

export interface Spec<A extends Argspec, P extends Paramspec> {
	argv: string[]
	argorder: (keyof A)[]
	args: A
	params: P
}
