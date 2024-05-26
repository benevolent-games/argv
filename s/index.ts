
// all errors
export * from "./errors/basic.js"
export * from "./errors/kinds/config.js"
export * from "./errors/kinds/mistakes.js"

// cli stuff
export * from "./areas/cli/cli.js"
export * from "./areas/cli/themes.js"
export * from "./areas/cli/types.js"

// things from analysis relevant to using cli
export * from "./areas/analysis/helpers.js"
export * from "./areas/analysis/types/units.js"
export * from "./areas/analysis/types/commands.js"
export * as helpers from "./areas/analysis/helpers.js"
export * as validators from "./areas/analysis/validators.js"

// exporting useful tools for making a cli
export * from "./tooling/logger.js"
export * from "./tooling/text/coloring.js"
export * from "./tooling/death-with-dignity.js"
export * as tn from "./tooling/text/tn.js"
export * as fmt from "./tooling/text/formatting.js"

