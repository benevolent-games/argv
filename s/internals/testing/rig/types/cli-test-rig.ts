
import {Logger} from "../../utils/logger.js"
import {Field} from "../../../../types/field.js"
import {Command} from "../../../../types/command.js"

export type CliTestRig<
		FA extends Field.Group,
		FP extends Field.Group
	> = (argv: string[], o?: {columns?: number}) => {
	logger: Logger
	command: Command<FA, FP>
	readonly exitCode: undefined | number
}
