
import {argv} from "./argv.js"
import {program} from "../../../program.js"
import {Group} from "../../fielding/group.js"
import {exampleConfig} from "./example-config.js"
import {Command} from "../../commanding/command.js"
import {ParseResult} from "../../commanding/parse-result.js"

export const commandTester = <FA extends Group, FP extends Group>(
		command: Omit<Command<FA, FP>, "execute">
	) => ({

	async input(...i: string[]) {
		let result: ParseResult<FA, FP> = undefined as any

		const output = await program({
			...exampleConfig(),
			exit: false,
			argv: argv(...i),
			commands: () => (<Command>{
				...command,
				async execute(r) {
					result = r as any
				},
			}) as any,
		})

		return {...output, ...result}
	},
})
