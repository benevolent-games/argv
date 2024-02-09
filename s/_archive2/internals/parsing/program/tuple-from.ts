
export const tupleFrom = {
	cmd(cmd: string) {
		return cmd.toLowerCase().split(" ")
	},
	argv(argv: string[]) {
		const [,,...parts] = argv
		return parts.map(part => part.toLowerCase())
	},
}
