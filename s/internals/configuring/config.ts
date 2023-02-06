
import {Settings} from "./settings.js"
import {Environment} from "./environment.js"
import {Commands} from "../commanding/commands.js"
import {CommandSetup} from "../commanding/command-setup.js"

export type Config<C extends Commands> = Environment & Settings & {
	commands: CommandSetup<C>
}
