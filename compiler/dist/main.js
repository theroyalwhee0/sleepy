"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const sleepyjs_1 = require("@theroyalwhee0/sleepyjs");
const argv_1 = require("./argv");
const parse_1 = require("./parse");
const serialize_1 = require("./serialize");
async function main() {
    const argv = (0, argv_1.getArgv)();
    const parsed = await (0, parse_1.parseFile)(argv.source);
    const compiled = await (0, sleepyjs_1.compileParsed)(parsed, {
        optimize: argv.optimize,
        info: argv.details,
        source: argv.source,
    });
    await (0, serialize_1.outputCompiled)(argv.target, compiled, {
        overwrite: argv.overwrite,
    });
}
exports.main = main;
//# sourceMappingURL=main.js.map