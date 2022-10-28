"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseErrorCommand = exports.SyntaxErrorCommand = exports.ErrorCommand = void 0;
const _1 = require(".");
class ErrorCommand extends _1.Command {
    constructor() {
        super(...arguments);
        this.message = '';
        this.type = _1.CommandType.Error;
        this.line = 0;
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
    constructor() {
        super(...arguments);
        this.error = 'syntax';
    }
}
exports.SyntaxErrorCommand = SyntaxErrorCommand;
class ParseErrorCommand extends ErrorCommand {
    constructor(err, content, line) {
        super();
        this.error = 'parse';
        this.message = 'Unable to parse command';
        this.line = line + 1;
        if (err.message) {
            this.message = err.message.replace(/\s?JSON\s?/, ' ');
        }
    }
}
exports.ParseErrorCommand = ParseErrorCommand;
//# sourceMappingURL=error.js.map