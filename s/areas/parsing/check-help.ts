
import {cleave} from "./utils/cleave.js"

/** sniff out a "--help" param without a full parse job */
export function checkHelp(strings: string[]) {
	const {before} = cleave(strings, "--")
	return before.some(s => s === "--help")
}

