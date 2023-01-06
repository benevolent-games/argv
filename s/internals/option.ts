
import {Type} from "../types/type.js"
import {TypeToValue} from "../types/type-to-value.js"

export interface ZOption<T extends Type> {
	type: T
	default?: TypeToValue<T>
	help?: string
}
