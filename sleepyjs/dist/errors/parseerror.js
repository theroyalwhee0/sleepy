"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = void 0;
const sleepyerror_1 = require("./sleepyerror");
class ParseError extends sleepyerror_1.SleepyError {
    constructor(message, lineNum = 0, cause) {
        super(message);
        this.parent = cause;
        this.lineNum = lineNum;
        if (cause instanceof Error && cause.name === 'SyntaxError') {
            this.details = cause.message.replace(/\bJSON\s+\b/, '');
        }
    }
}
exports.ParseError = ParseError;
//# sourceMappingURL=parseerror.js.map