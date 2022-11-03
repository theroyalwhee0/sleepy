"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginCommand = exports.EndCommand = void 0;
const command_1 = require("./command");
class EndCommand extends command_1.Command {
    constructor() {
        super(...arguments);
        this.type = command_1.CommandType.End;
    }
}
exports.EndCommand = EndCommand;
class BeginCommand extends command_1.Command {
    constructor() {
        super(...arguments);
        this.type = command_1.CommandType.Begin;
    }
}
exports.BeginCommand = BeginCommand;
//# sourceMappingURL=beginend.js.map