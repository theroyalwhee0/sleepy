"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgv = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
function getArgv(value, exit = true) {
    value = value ?? process.argv;
    return (0, yargs_1.default)((0, helpers_1.hideBin)(value))
        .scriptName('zzzc')
        .command('$0 <source> <target> [args]', 'Compile the source to the target location.', (yargs) => {
        return yargs
            // Details.
            .boolean('details')
            .describe('details', 'Add build details to output')
            .default('details', true)
            // Optimize
            .boolean('optimize')
            .describe('optimize', 'Optimize output')
            .default('optimize', true)
            // Overwrite
            .boolean('overwrite')
            .describe('overwrite', 'Overwrite target if it exists')
            .alias('o', 'overwrite')
            .default('overwrite', false);
    })
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync();
}
exports.getArgv = getArgv;
//# sourceMappingURL=argv.js.map