#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {themes} from "../areas/cli/themes.js"
import {arg, choice, command, number, param, string} from "../areas/analysis/helpers.js"

const input = cli(process.argv, {
	name: "cafe",
	columns: process.stdout.columns,
	readme: "https://github.com/benevolent-games/argv",
	help: `
		a vibrant italian café that tantalizes taste buds with its perfect combination of artisanal pizzas and creamy, homemade gelato.
	`,
	commands: {
		pizza: command({
			help: `made with the finest mozza, mama mia!`,
			args: [
				arg("size").required(string, choice(["small", "medium", "large"])),
				arg("crust").default(string, "thick", choice(["thick", "thin"])),
			],
			params: {
				slices: param.required(number, {help: `we serve it by the slice`}),
				pepperoni: param.flag("p", {help: `
					we go heavy on the meaty pepperoni
				`}),
				mushrooms: param.flag("m", {help: `fresh fungi`}),
			},
		}),
		icecream: command({
			help: `it's actually gelatto!`,
			args: [
				arg("vessel").default(string, "waffle", choice(["cone", "waffle", "bowl"])),
			],
			params: {
				scoops: param.required(number, {help: `how many scoops do you want?`}),
				flavor: param.default(string, "vanilla", {help: `pick your favorite`}),
				"choco-dipped": param.flag("d", {help: `dunked for a chocolate coating`}),
			},
		}),
	},
})

console.log("pizza", input.tree.pizza)
console.log("icecream", input.tree.icecream)

