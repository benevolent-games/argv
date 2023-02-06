
import {Command} from "./command.js"
import {Group} from "../fielding/group.js"

export function asCommand<
		FA extends Group,
		FP extends Group,
	>(c: Command<FA, FP>): Command<any, any> {

	return c
}
