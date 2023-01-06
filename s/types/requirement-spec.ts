
import {Type} from "./type.js"

export interface RequirementSpec<T extends Type> {
	type: T
	help?: string
}
