
import {Output} from "./output.js"
import {Config} from "../configuring/config.js"
import {Exiter} from "../configuring/exiter.js"
import {Commands} from "../commanding/commands.js"

export type ProgramResult<C extends Config<Commands>> = (
	C["exit"] extends Exiter
		? void
		: Output
)
