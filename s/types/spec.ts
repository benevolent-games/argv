
import {ZField} from "./field.js"

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
