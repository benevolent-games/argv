
import {Theme} from "../helping/theme.js"

export interface Settings {
	name: string
	help?: string
	readme?: string
	tips?: boolean
	theme?: Theme
}
