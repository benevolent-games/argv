
import {Args} from "./args.js"
import {Params} from "./params.js"
import {CommandAnalysis} from "./analysis.js"

export type CommandTree = Command | {[key: string]: CommandTree}

export type CommandOptions<A extends Args, P extends Params> = {
	args: A
	params: P
	help: string
	execute?: (analysis: CommandAnalysis<Command<A, P>>) => Promise<void>
}

export class Command<A extends Args = any, P extends Params = any> {
	args: A
	params: P
	help: string
	execute: (analysis: CommandAnalysis<Command<A, P>>) => Promise<void>
	constructor(o: CommandOptions<A, P>) {
		this.args = o.args
		this.params = o.params
		this.help = o.help
		this.execute = o.execute ?? (async() => {})
	}
}

