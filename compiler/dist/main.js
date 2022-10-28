"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const argv_1 = require("./argv");
const compile_1 = require("./compile");
async function main() {
    const argv = (0, argv_1.getArgv)();
    console.log('@@ argv: ', argv);
    const result = await (0, compile_1.compileFile)(argv.source);
    console.log('@@ result: ', result);
}
exports.main = main;
//# sourceMappingURL=main.js.map