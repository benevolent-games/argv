
import {palette} from "./palette.js"
import {Type} from "../../../types/type.js"

export function stype(type: Type) {
	switch (type) {

		case String:
			return palette.type("string")

		case Number:
			return palette.type("number")

		case Boolean:
			return palette.type("boolean")
	}
}
