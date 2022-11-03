"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecError = void 0;
const sleepyerror_1 = require("./sleepyerror");
class ExecError extends sleepyerror_1.SleepyError {
    constructor(message = 'An error occured during script execution', lineNum = 0, cause) {
        super(message, lineNum, cause);
    }
}
exports.ExecError = ExecError;
//# sourceMappingURL=execerror.js.map