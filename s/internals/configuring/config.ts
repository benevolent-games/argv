
import {Settings} from "./settings.js"
import {Environment} from "./environment.js"
import {Commands} from "../commanding/commands.js"
import {asCommand} from "../commanding/as-command.js"

export type Config<C extends Commands = Commands> = Environment & Settings & {
	commands: (c: typeof asCommand) => C
}
