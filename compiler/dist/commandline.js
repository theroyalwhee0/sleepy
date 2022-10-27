"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandLine = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
function getCommandLine() {
    const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .options({})
        .parseSync();
    return argv;
}
exports.getCommandLine = getCommandLine;
//# sourceMappingURL=commandline.js.map