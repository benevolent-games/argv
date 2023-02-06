
import {Group} from "../fielding/group.js"
import {ParseResult} from "./parse-result.js"

export interface Command<
		FA extends Group = Group,
		FP extends Group = Group
	> {
	help: string
	argorder: (keyof FA)[]
	args: FA
	params: FP
	execute: ({}: ParseResult<FA, FP>) => Promise<void>
}
