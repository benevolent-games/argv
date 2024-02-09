
import {Exiter} from "./exiter.js"
import {Logger} from "../tooling/logger.js"

export interface Environment {
	argv: string[]
	columns: number
	logger: Logger
	exit: Exiter | false | "throw_on_error"
}
