"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCompiled = void 0;
function serializeCompiled(compiled, options) {
    const pretty = options?.pretty ?? false;
    return compiled.rows.map((value) => {
        if (pretty) {
            return JSON.stringify(value, null, ' ').replace(/\s*\n\s*/g, ' ');
        }
        else {
            return JSON.stringify(value);
        }
    }).join('\n');
}
exports.serializeCompiled = serializeCompiled;
//# sourceMappingURL=serialize.js.map