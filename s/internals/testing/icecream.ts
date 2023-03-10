
import {cli} from "../../cli.js"

type Args = {
	vessel: string
}

type Params = {
	help: boolean
	flavor: string
	scoops: number
}

const {args, params} = cli<Args, Params>()({
	program: "icecream",
	argv: process.argv,
	columns: process.stdout.columns ?? 80,

	readme: "https://github.com/@benev/argv",
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

console.log({args, params})
