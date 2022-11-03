"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepyError = void 0;
class SleepyError extends Error {
    constructor(message, lineNum = 0, cause) {
        super(message);
        this.lineNum = 0;
        this.lineNum = lineNum;
        this.parent = cause;
    }
}
exports.SleepyError = SleepyError;
//# sourceMappingURL=sleepyerror.js.map