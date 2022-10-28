"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _CommentCommand_re_comment, _b, _BlankCommand_re_blank;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlankCommand = exports.CommentCommand = exports.NoopCommand = void 0;
const _1 = require(".");
class NoopCommand extends _1.Command {
    constructor() {
        super(...arguments);
        this.type = _1.CommandType.Noop;
    }
}
exports.NoopCommand = NoopCommand;
class CommentCommand extends NoopCommand {
    get comment() {
        let text = '';
        if (this.content) {
            text = this.content.replace(/^\s*#\s*/, '');
        }
        return text;
    }
    static is(value) {
        return __classPrivateFieldGet(CommentCommand, _a, "f", _CommentCommand_re_comment).test(value);
    }
    toJSON() {
        return [this.type, this.comment];
    }
}
exports.CommentCommand = CommentCommand;
_a = CommentCommand;
_CommentCommand_re_comment = { value: /^\s*#/ };
Object.defineProperty(CommentCommand.prototype, 'comment', { enumerable: true });
class BlankCommand extends NoopCommand {
    static is(value) {
        return __classPrivateFieldGet(BlankCommand, _b, "f", _BlankCommand_re_blank).test(value);
    }
}
exports.BlankCommand = BlankCommand;
_b = BlankCommand;
_BlankCommand_re_blank = { value: /^\s*$/ };
//# sourceMappingURL=noop.js.map