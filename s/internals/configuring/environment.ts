
import {Logger} from "../tooling/logger.js"

export interface Environment {
	argv: string[]
	columns: number
	logger: Logger
	exit: false | ((code: number) => void)
}
