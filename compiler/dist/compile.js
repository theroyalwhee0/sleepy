"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileStream = exports.compileText = exports.compileFile = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const parse_1 = require("./parse");
async function compileFile(filename) {
    const stream = node_fs_1.default.createReadStream(filename);
    try {
        return await compileStream(stream);
    }
    finally {
        stream.close();
    }
}
exports.compileFile = compileFile;
async function compileText(input) {
    const parsed = await (0, parse_1.parseText)(input);
    const compiled = {
        compiled: parsed.parsed,
    };
    return compiled;
}
exports.compileText = compileText;
async function compileStream(input) {
    const parsed = await (0, parse_1.parseStream)(input);
    const compiled = {
        compiled: parsed.parsed,
    };
    return compiled;
}
exports.compileStream = compileStream;
//# sourceMappingURL=compile.js.map