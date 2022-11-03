"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileParsed = exports.compileIterable = exports.compileText = exports.sleepy_version = void 0;
const commands_1 = require("./commands");
const parse_1 = require("./parse");
const iter_1 = require("./utilities/iter");
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
async function compileParsed(parsed, options) {
    const now = new Date();
    async function* generator() {
        const optimize = options?.optimize ?? true;
        const includeCompileInfo = options?.info ?? false;
        const sourceName = options?.source ?? '';
        yield ['@begin', exports.sleepy_version];
        if (includeCompileInfo) {
            yield ['@meta', '@date', now.toISOString()];
            if (sourceName) {
                yield ['@meta', '@source', sourceName];
            }
        }
        for await (const item of parsed.rows) {
            if (includeRow(optimize, item)) {
                yield item.toJSON();
            }
        }
        yield ['@end'];
    }
    const iterable = generator();
    const rows = options?.validateNow === true ? await (0, iter_1.bufferIterable)(iterable) : iterable;
    return {
        rows: rows,
    };
}
exports.compileParsed = compileParsed;
function includeRow(optimize, cmd) {
    if (optimize === true) {
        return cmd.type !== commands_1.CommandType.Noop;
    }
    return true;
}
//# sourceMappingURL=compile.js.map