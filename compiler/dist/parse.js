"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const sleepyjs_1 = require("@theroyalwhee0/sleepyjs");
async function parseFile(filename) {
    const stream = node_fs_1.default.createReadStream(filename, 'utf8');
    try {
        return await (0, sleepyjs_1.parseIterable)(stream);
    }
    finally {
        stream.close();
    }
}
exports.parseFile = parseFile;
//# sourceMappingURL=parse.js.map