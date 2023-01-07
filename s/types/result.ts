
import {Spec5} from "./spec.js"
import {ZField} from "./field.js"
import {Values} from "./values.js"
import {Fields2} from "./fields.js"
import {FieldsToResults, ZFieldsToResults} from "./fields-to-results.js"

export type PResult<
		FA extends ZField.GroupFromValues<Values>,
		FP extends ZField.GroupFromValues<Values>
	> = {
	spec: Spec5<FA, FP>
	args: ZFieldsToResults<FA>
	params: ZFieldsToResults<FP>
	executable: string
	module: string
}

export type ZResult<
		FA extends ZField.GroupFromValues<Values>,
		FP extends ZField.GroupFromValues<Values>
	> = {
	spec: Spec5<FA, FP>
	parse: () => PResult<FA, FP>
}

export interface Result<A extends Fields2<Values>, P extends Fields2<Values>> {
	args: FieldsToResults<A>
	params: FieldsToResults<P>
}
