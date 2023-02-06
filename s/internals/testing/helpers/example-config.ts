
import {Config} from "../../configuring/config.js"
import {Commands} from "../../commanding/commands.js"
import {DisabledLogger} from "../../tooling/logger.js"

export function exampleConfig() {
	return {
		name: "example",
		columns: 72,
		logger: new DisabledLogger(),
		exit: false,
	} satisfies Omit<Config<Commands>, "argv" | "commands">
}
