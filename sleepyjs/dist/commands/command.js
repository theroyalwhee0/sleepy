"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Command_re_command;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandType = void 0;
var CommandType;
(function (CommandType) {
    CommandType["Noop"] = "@noop";
    CommandType["Begin"] = "@begin";
    CommandType["End"] = "@end";
    CommandType["Error"] = "@error";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
class Command {
    static is(value) {
        return __classPrivateFieldGet(Command, _a, "f", _Command_re_command).test(value);
    }
    toJSON() {
        return [this.type];
    }
}
exports.Command = Command;
_a = Command;
_Command_re_command = { value: /^\s*\[.*\]\s*,?\s*$/ };
//# sourceMappingURL=command.js.map