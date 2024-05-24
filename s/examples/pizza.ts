#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {themes} from "../areas/cli/themes.js"
import {arg, choice, command, param, type} from "../areas/analysis/helpers.js"

await cli(process.argv, {
	name: "pizza",
	readme: "https://benev.gg/",
	commands: command({
		help: "made with the finest mozza!",
		args: [
			arg("size").required(type.string, choice(["small", "medium", "large"])),
		],
		params: {
			slices: param.default(type.number, "1", {help: "we serve it by the slice"}),
			pepperoni: param.flag("p", {help: "we go heavy on the meaty pepperoni"}),
		},
		async execute(input) {
			console.log(input)
		},
	}),
}).execute()

