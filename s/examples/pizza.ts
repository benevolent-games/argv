#!/usr/bin/env node

import {cli} from "../cli/cli.js"
import {themes} from "../cli/themes.js"
import {arg, command, param} from "../analysis/helpers.js"

const input = cli(process.argv, {
	name: "pizza",
	// theme: themes.dracula,
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

