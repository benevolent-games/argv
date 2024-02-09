
import {cli} from "./cli/cli.js"
import {arg, args, command, param, params} from "./cli/helpers.js"

const argv = cli({
	name: "icecream",
	commands: command(
		`make incredible iced cream.`,
		args(
			arg.required("vessel", String, `choose "cone" or "waffle-cone".`),
		),
		params({
			scoops: param.required(Number, `how many scoops?`),
			flavor: param.default(String, "vanilla", `what flavor?`),
			sprinkles: param.optional(Boolean, `do you want sprinkles?`),
		}),
	),
})

argv.args.vessel
argv.params.scoops
argv.params.flavor
argv.params.sprinkles

