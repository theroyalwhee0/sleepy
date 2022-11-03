"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputCompiled = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const sleepyjs_1 = require("@theroyalwhee0/sleepyjs");
async function outputCompiled(target, compiled, options) {
    const flags = options?.overwrite === true ? 'w' : 'wx';
    const stream = node_fs_1.default.createWriteStream(target, {
        flags,
        encoding: 'utf8',
    });
    for await (const item of (0, sleepyjs_1.serializeCompiled)(compiled)) {
        stream.write(item);
        stream.write('\n');
    }
}
exports.outputCompiled = outputCompiled;
//# sourceMappingURL=serialize.js.map