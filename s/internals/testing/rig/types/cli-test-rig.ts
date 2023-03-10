
import {Field} from "../../../../types/field.js"
import {MemoryLogger} from "../../utils/logger.js"
import {Command} from "../../../../types/command.js"

export type CliTestRig<
		FA extends Field.Group,
		FP extends Field.Group
	> = (argv: string[], o?: {columns?: number}) => {
	logger: MemoryLogger
	command: Command<FA, FP>
	readonly exitCode: undefined | number
}
