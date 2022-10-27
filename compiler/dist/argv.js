"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgv = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
function getArgv() {
    return (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .scriptName('zzzc')
        .command('$0 <source> <target> [args]', 'Compile the source to the target location. Use - to output to stdout.')
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .strict()
        .parseSync();
}
exports.getArgv = getArgv;
//# sourceMappingURL=argv.js.map