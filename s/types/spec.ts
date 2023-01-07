
import {Field} from "./field.js"

export interface Spec<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group
	> {
	bin: string
	argv: string[]
	argorder: (keyof FA)[]
	args: FA
	params: FP
	readme?: string
	help?: string
	columns?: number
	tips?: boolean
}
