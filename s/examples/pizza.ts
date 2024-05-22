#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {arg, choice, command, param} from "../areas/analysis/helpers.js"

const input = cli(process.argv, {
	name: "pizza",
	columns: process.stdout.columns,
	readme: "https://github.com/benevolent-games/argv",
	commands: command({
		help: "made with the finest mozza!",
		args: [
			arg.required("size", String, choice(["small", "medium", "large"])),
		],
		params: {
			slices: param.required(Number, {help: "we serve it by the slice"}),
			pepperoni: param.flag("p", {help: "we go heavy on the meaty pepperoni"}),
		},
	}),
})

console.log("pizza", input.tree)

