
import {Type} from "./type.js"
import {TypeToValue} from "./type-to-value.js"

export interface OptionSpec<T extends Type> {
	type: T
	default?: TypeToValue<T>
	help?: string
}
