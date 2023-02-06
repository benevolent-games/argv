
import {Group} from "./group.js"
import {Option} from "./field.js"
import {TypeToValue} from "./type-to-value.js"

export type ValuesFromGroup<F extends Group> = {
	[key in keyof F]: F[key] extends Option<F[key]["type"]>
		? TypeToValue<F[key]["type"]> | undefined
		: TypeToValue<F[key]["type"]>
}
