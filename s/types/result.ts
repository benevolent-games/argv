
import {Spec5} from "./spec.js"
import {ZField} from "./field.js"
import {Values} from "./values.js"
import {Fields2} from "./fields.js"
import {FieldsToResults, ZFieldsToResults} from "./fields-to-results.js"

export interface ZResult<
		FA extends ZField.Group<Values>,
		FP extends ZField.Group<Values>
	> {
	spec: Spec5<FA, FP>
	executable: string
	module: string
	args: ZFieldsToResults<FA>
	params: ZFieldsToResults<FP>
}

export interface Result<A extends Fields2<Values>, P extends Fields2<Values>> {
	args: FieldsToResults<A>
	params: FieldsToResults<P>
}
