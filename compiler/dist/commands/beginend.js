"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginCommand = exports.EndCommand = void 0;
const _1 = require(".");
class EndCommand extends _1.Command {
    constructor() {
        super(...arguments);
        this.type = _1.CommandType.End;
    }
}
exports.EndCommand = EndCommand;
class BeginCommand extends _1.Command {
    constructor() {
        super(...arguments);
        this.type = _1.CommandType.Begin;
    }
}
exports.BeginCommand = BeginCommand;
//# sourceMappingURL=beginend.js.map