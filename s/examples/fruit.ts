#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {arg, choice, command, param} from "../areas/analysis/helpers.js"

const input = cli(process.argv, {
	name: "fruit",
	columns: process.stdout.columns,
	commands: command({
		args: [
			arg.required("kind", String, choice(["apple", "orange", "banana"])),
		],
		params: {
			count: param.required(Number),
			peeled: param.flag("p"),
		},
	}),
})

console.log("fruit", input.tree)

