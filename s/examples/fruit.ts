#!/usr/bin/env node

import {cli} from "../cli/cli.js"
import {arg, chooser, command, param} from "../analysis/helpers.js"

const input = cli(process.argv, {
	name: "fruit",
	columns: process.stdout.columns,
	commands: command({
		args: [
			arg.required("kind", String, chooser({
				choices: ["apple", "orange", "banana"],
			})),
		],
		params: {
			count: param.required(Number),
			peeled: param.flag("p"),
		},
	}),
})

console.log("fruit", input.tree)

