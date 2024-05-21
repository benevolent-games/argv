
import {arg, command, param} from "./helpers.js"
import {TreeAnalysis} from "./types/analysis.js"

const lol = command({
	help: `lol`,
	args: [
		arg.optional("lmao", String, {
			help: `asdasd`,
		}),
		arg.required("danger", String, {
			help: `asdasd`,
		}),
		arg.default("qwe", Number, {
			fallback: 234,
			help: `qweqwe`,
		})
	],
	params: {
		alpha: param.default(Number, {
			help: `alphalpha`,
			fallback: 123,
		}),
	},
	// execute: async analysis => {
	// 	analysis.args.qwe
	// },
})

const a: TreeAnalysis<typeof lol> = undefined as any
a.params.alpha
a.args.qwe
a.args.lmao

