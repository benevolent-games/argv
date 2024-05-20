
import {cleave} from "./utils/cleave.js"

export function checkHelp(strings: string[]) {
	const {before} = cleave(strings, "--")
	return before.some(s => s === "--help")
}

