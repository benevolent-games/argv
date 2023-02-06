
import {Group} from "../fielding/group.js"
import {ValuesFromGroup} from "../fielding/values-from-group.js"

export interface ParseResult<
		FA extends Group = Group,
		FP extends Group = Group,
	> {
	args: ValuesFromGroup<FA>
	params: ValuesFromGroup<FP>
	executable: string
	module: string
}
