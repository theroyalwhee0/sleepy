"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCommand = void 0;
const istype_1 = require("@theroyalwhee0/istype");
const command_1 = require("./command");
class UserCommand extends command_1.Command {
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
//# sourceMappingURL=usercommand.js.map