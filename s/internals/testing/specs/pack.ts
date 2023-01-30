
import {NuSpec} from "../../../program.js"

export const pack = (...args: string[]) => ({
	name: "pack",
	argv: ["node", "./script.js", ...args],
	columns: 72,

	readme: "https://github.com/benevolent-games/pack",
	help: `interact with benevolent asset packs`,

	commands: command => ({

		check: command({
			argorder: ["packname", "version"],
			help: `get information about a pack`,
			args: {
				packname: {
					type: String,
					mode: "default",
					default: ".",
					help: `query the cloud for info about a pack`,
				},
				version: {
					type: String,
					mode: "default",
					default: "*",
					help: `semver specifier for which version you want`,
				},
			},
			params: {},
		}),

		pack: command({
			help: ``,
			argorder: [],
			args: {},
			params: {},
		}),

		up: command({
			help: `publish a new version of this pack`,
			argorder: ["version", "changes"],
			args: {
				version: {
					type: String,
					mode: "requirement",
					help: `the exact version number youw want to publish`,
				},
				changes: {
					type: String,
					mode: "requirement",
					help: `a description of what's new or different in this version`,
				},
			},
			params: {},
		}),

		down: command({
			help: `download a pack`,
			argorder: ["packname", "version"],
			args: {
				packname: {
					type: String,
					mode: "requirement",
					help: ``,
				},
				version: {
					type: String,
					mode: "default",
					default: "*",
					help: ``,
				},
			},
			params: {},
		}),

		revoke: command({
			help: `unpublish and delete a pack`,
			argorder: ["packname", "version"],
			args: {
				packname: {
					type: String,
					mode: "requirement",
					help: ``,
				},
				version: {
					type: String,
					mode: "requirement",
					help: ``,
				},
			},
			params: {},
		}),
	}),
} satisfies NuSpec)
