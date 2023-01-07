
import {palette} from "./palette.js"
import {ZField} from "../../../types/field.js"

export function mode(mode: ZField.Mode) {
	switch (mode) {

		case "requirement":
			return palette.required("required")

		case "option":
			return palette.mode("optional")

		case "default":
			return palette.mode("default")
	}
}
