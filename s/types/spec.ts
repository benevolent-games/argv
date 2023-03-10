
import {Field} from "./field.js"
import {Theme} from "../theme.js"

export interface Spec<
		FA extends Field.Group = Field.Group,
		FP extends Field.Group = Field.Group
	> {

	/** the name of your program's executable */
	program: string

	/** command line arguments (in node, use process.argv) */
	argv: string[]

	/** positional arguments your program will accept */
	argorder: (keyof FA)[]

	/** arguments specification */
	args: FA

	/** parameters specification */
	params: FP

	/** url to your program's readme */
	readme?: string

	/** description and usage instructions for your program */
	help?: string

	/** current terminal width, used for text-wrapping */
	columns?: number

	/** display "tips" section at end of +help page */
	tips?: boolean

	/** color palette to use in the +help page */
	theme?: Theme
}
