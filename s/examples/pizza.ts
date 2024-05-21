#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {arg, command, param} from "../areas/analysis/helpers.js"

const input = cli(process.argv, {
	name: "pizza",
	columns: process.stdout.columns,
	help: `are you in the mood for pizza, or icecream?`,
	commands: command({
		help: `made with the finest mozza!`,
		args: [
			arg.required("size", String, {help: `small, medium, or large?`}),
		],
		params: {
			slices: param.required(Number, {help: `we serve it by the slice`}),
			pepperoni: param.flag("p", {help: `we go heavy on the meaty pepperoni`}),
			mushrooms: param.flag("m", {help: `fresh fungi`}),
		},
	}),
})

console.log("pizza", input.tree)

