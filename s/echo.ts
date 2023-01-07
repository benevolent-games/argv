#!/usr/bin/env node

import {color} from "./tools/colors.js"
import {parse} from "./internals/parse.js"
import {stdcolumns} from "./internals/constants.js"
import {palette} from "./internals/helping/palette.js"

const command = parse({
	bin: "argv-echo",
	argv: process.argv,
	columns: process.stdout.columns ?? stdcolumns,
	argorder: [],
	args: {},
	params: {},
})

console.log(color.blue("executable"), command.executable)
console.log(color.blue("module"), command.module)
console.log(palette.arg("args"), command.args)
console.log(palette.param("params"), command.params)
