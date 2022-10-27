"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Command_re_command;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCommand = exports.Command = exports.CommandType = void 0;
const istype_1 = require("@theroyalwhee0/istype");
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
class UserCommand extends Command {
    constructor(type, args = []) {
        super();
        this.type = type;
        if (args.length !== 0) {
            this.args = args;
        }
    }
    static create(data) {
        if (data.length === 0) {
            throw new Error('Expected at least one element in input.');
        }
        if (!(0, istype_1.isString)(data[0])) {
            throw new Error('Expected element 0 of input to be a string');
        }
        const type = '' + data[0];
        const args = data.slice(1);
        const cmd = new UserCommand(type, args);
        return cmd;
    }
    toJSON() {
        return [this.type, ...(this.args ?? [])];
    }
}
exports.UserCommand = UserCommand;
//# sourceMappingURL=index.js.map