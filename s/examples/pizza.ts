#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {arg, choice, command, param} from "../areas/analysis/helpers.js"

await cli(process.argv, {
	name: "pizza",
	readme: "https://benev.gg/",
	commands: command({
		help: "made with the finest mozza!",
		args: [
			arg("size").required(String, choice(["small", "medium", "large"])),
		],
		params: {
			slices: param.default(Number, {fallback: 1, help: "we serve it by the slice"}),
			pepperoni: param.flag("p", {help: "we go heavy on the meaty pepperoni"}),
		},
		async execute(input) {
			console.log(input)
		},
	}),
}).execute()

