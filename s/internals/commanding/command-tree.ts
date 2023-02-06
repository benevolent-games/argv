
import {Command} from "./command.js"

export interface CommandTree {
	[key: string]: CommandTree | Command<any, any>
}
