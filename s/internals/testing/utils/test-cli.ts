
import {cli} from "../../../cli.js"
import {MemoryLogger} from "./logger.js"
import {Field} from "../../../types/field.js"
import {Values} from "../../../types/values.js"

export function testCli<
		A extends Values,
		P extends Values
	>() {

	return function<
			FA extends Field.GroupFromValues<A>,
			FP extends Field.GroupFromValues<P>
		>({argorder, args, params}: {
			argorder: (keyof FA)[]
			args: FA
			params: FP
		}) {

		return function(
				argv: string[],
				{columns = 80}: {columns?: number} = {},
			) {

			let lastExitCode: undefined | number
			const exit = (code: number) => { lastExitCode = code }

			const logger = new MemoryLogger()
			const cliopts = {logger, exit}

			const command = cli<A, P>(cliopts)({
				program: "test",
				readme: "https://github.com/benevolent-games/argv",
				help: "test cli program",
				argv,
				columns,
				argorder,
				args,
				params,
			})

			return {
				logger,
				command,
				get exitCode() { return lastExitCode },
			}
		}
	}
}
