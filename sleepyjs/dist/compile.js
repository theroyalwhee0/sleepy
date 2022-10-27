"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileParsed = exports.compileIterable = exports.compileText = exports.sleepy_version = void 0;
const commands_1 = require("./commands");
const parse_1 = require("./parse");
exports.sleepy_version = [0, 0, 1];
async function compileText(input, options) {
    const parsed = await (0, parse_1.parseText)(input);
    return compileParsed(parsed, options);
}
exports.compileText = compileText;
async function compileIterable(input, options) {
    const parsed = await (0, parse_1.parseIterable)(input);
    return compileParsed(parsed, options);
}
exports.compileIterable = compileIterable;
function optimizeRows(optimize) {
    if (optimize === true) {
        return (_) => _.type !== commands_1.CommandType.Noop;
    }
    return () => true;
}
async function compileParsed(parsed, options) {
    const now = new Date();
    const optimize = options?.optimize ?? true;
    const includeCompileInfo = options?.info ?? false;
    const sourceName = options?.source ?? '';
    const compileInfo = [];
    if (includeCompileInfo) {
        compileInfo.push(['@meta', '@date', now.toISOString()]);
        if (sourceName) {
            compileInfo.push(['@meta', '@source', sourceName]);
        }
    }
    const rows = [].concat([['@begin', exports.sleepy_version]], compileInfo, parsed.rows
        .filter(optimizeRows(optimize))
        .map((_) => _.toJSON()), [['@end']]);
    const result = {
        rows,
    };
    return result;
}
exports.compileParsed = compileParsed;
//# sourceMappingURL=compile.js.map