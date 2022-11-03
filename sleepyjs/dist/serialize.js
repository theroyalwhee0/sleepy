"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCompiled = void 0;
async function* serializeCompiled(compiled, options) {
    const pretty = options?.pretty ?? false;
    for await (const value of compiled.rows) {
        if (pretty) {
            yield JSON.stringify(value, null, ' ').replace(/\s*\n\s*/g, ' ');
        }
        else {
            yield JSON.stringify(value);
        }
    }
}
exports.serializeCompiled = serializeCompiled;
//# sourceMappingURL=serialize.js.map