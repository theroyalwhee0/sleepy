"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const argv_1 = require("./argv");
const compile_1 = require("./compile");
async function main() {
    const argv = (0, argv_1.getArgv)();
    const compiled = await (0, compile_1.compileFile)(argv.source);
    console.log('@@ compiled: ', JSON.stringify(compiled, null, '\t'));
    // await outputCompiled(argv.target, compiled);
}
exports.main = main;
//# sourceMappingURL=main.js.map