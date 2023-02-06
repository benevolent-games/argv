
import {Commands} from "./commands.js"
import {asCommand} from "./as-command.js"

export type CommandSetup<C extends Commands> = (c: typeof asCommand) => C
