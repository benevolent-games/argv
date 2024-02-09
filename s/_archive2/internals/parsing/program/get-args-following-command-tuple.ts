
export function getArgsFollowingCommandTuple(
		tuple: string[],
		args: string[],
	) {
	return (tuple.length > 0)
		? args.slice(tuple.length - 1)
		: args
}
