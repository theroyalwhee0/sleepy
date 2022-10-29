"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseErrorCommand = exports.SyntaxErrorCommand = exports.ErrorCommand = void 0;
const _1 = require(".");
class ErrorCommand extends _1.Command {
    constructor(error, message, line) {
        super();
        this.message = '';
        this.type = _1.CommandType.Error;
        this.line = 0;
        if (error !== undefined) {
            this.error = error;
        }
        if (message !== undefined) {
            this.message = message;
        }
        if (line !== undefined) {
            this.line = line + 1;
        }
    }
    toJSON() {
        if (this.message) {
            return [this.type, this.error, this.message];
        }
        else {
            return [this.type, this.error];
        }
    }
}
exports.ErrorCommand = ErrorCommand;
class SyntaxErrorCommand extends ErrorCommand {
    constructor(message, line) {
        super('syntax', message, line);
    }
}
exports.SyntaxErrorCommand = SyntaxErrorCommand;
class ParseErrorCommand extends ErrorCommand {
    constructor(err, line) {
        super('parse', 'Unable to parse command', line);
        if (err?.message) {
            this.message = err.message.replace(/\s?JSON\s?/, ' ');
        }
    }
}
exports.ParseErrorCommand = ParseErrorCommand;
//# sourceMappingURL=error.js.map