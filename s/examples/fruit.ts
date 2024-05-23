#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {command, choice, arg, param, type} from "../areas/analysis/helpers.js"

const {args, params} = cli(process.argv, {
	name: "fruit",
	commands: command({
		args: [
			arg("kind").required(type.string, choice(["apple", "orange", "banana"])),
		],
		params: {
			count: param.default(type.number, "1"),
			peeled: param.flag("p"),
		},
	}),
}).tree

args.kind // "apple"
params.count // 1
params.peeled // false

console.log({args, params})

