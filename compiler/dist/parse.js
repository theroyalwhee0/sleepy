"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_readline_1 = __importDefault(require("node:readline"));
const sleepyjs_1 = require("@theroyalwhee0/sleepyjs");
async function parseFile(filename) {
    const stream = node_fs_1.default.createReadStream(filename, 'utf8');
    const lineReader = node_readline_1.default.createInterface(stream);
    return await (0, sleepyjs_1.parseIterable)(lineReader);
}
exports.parseFile = parseFile;
//# sourceMappingURL=parse.js.map