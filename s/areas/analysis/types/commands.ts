
import {Args, Params} from "./sketch.js"
import {CommandAnalysis} from "./analysis.js"
import {validateCommand} from "../utils/validate-command.js"

export type CommandTree = Command<any, any> | {[key: string]: CommandTree}

export type CommandOptions<A extends Args, P extends Params> = {
	args: A
	params: P
	help?: string
	execute?: (analysis: CommandAnalysis<Command<A, P>>) => Promise<void>
}

export class Command<A extends Args = Args, P extends Params = Params> {
	args: A
	params: P
	help: string | undefined
	execute: (analysis: CommandAnalysis<Command<A, P>>) => Promise<void>

	constructor(o: CommandOptions<A, P>) {
		this.args = o.args
		this.params = o.params
		this.help = o.help
		this.execute = o.execute ?? (async() => {})
		validateCommand(this as Command<any, any>)
	}
}

