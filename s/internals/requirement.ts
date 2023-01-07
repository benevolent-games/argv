
import {Type} from "../types/type.js"

export interface ZRequirement<T extends Type> {
	type: T
	requirement: true
	help?: string
}
