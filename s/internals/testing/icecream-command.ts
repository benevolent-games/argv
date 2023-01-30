
import {CommandSetup} from "../../program.js"
import {exampleProgram} from "./specs/dummy-command.js"

type Args = {
	vessel: string
}

type Params = {
	help: boolean
	flavor: string
	scoops: number
}

export function icecreamProgram() {
	return exampleProgram<Args, Params>(icecreamCommand)
}

export const icecreamCommand: CommandSetup = command => command<Args, Params>({
	help: `example cli program for demonstration purposes`,
	argorder: ["vessel"],
	args: {
		vessel: {
			type: String,
			mode: "requirement",
			help: `can be "cone", "bowl", or "waffle-cone"`,
		},
	},
	params: {
		flavor: {
			type: String,
			mode: "default",
			default: "vanilla",
			help: `your favorite icecream flavor`,
		},
		scoops: {
			type: Number,
			mode: "requirement",
			help: `number of icecream scoops`,
		},
		help: {
			type: Boolean,
			mode: "option",
			help: `trigger the help page`,
		},
	},
})
