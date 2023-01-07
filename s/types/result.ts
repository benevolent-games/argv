
import {Spec5} from "./spec.js"
import {ZField} from "./field.js"
import {Values} from "./values.js"

export type PResult<
		FA extends ZField.GroupFromValues<Values>,
		FP extends ZField.GroupFromValues<Values>
	> = {
	spec: Spec5<FA, FP>
	args: ZField.ValuesFromGroup<FA>
	params: ZField.ValuesFromGroup<FP>
	executable: string
	module: string
}
