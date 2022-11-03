"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execCompiled = void 0;
const istype_1 = require("@theroyalwhee0/istype");
const execerror_1 = require("./errors/execerror");
async function execCompiled(compiled, evaluator) {
    const state = {};
    const ctx = {
        lineNum: 0,
        state,
    };
    for await (const item of compiled.rows) {
        ctx.lineNum += 1;
        if (item.length === 0) {
            throw new execerror_1.ExecError('Expected row to have a command name', ctx.lineNum);
        }
        const [command, ...rest] = item;
        if (!(0, istype_1.isString)(command)) {
            throw new execerror_1.ExecError('Expected command name to be a string', ctx.lineNum);
        }
        const ch = command[0] || '';
        if (ch === '@') {
            // Ignore language commands.
            switch (command) {
                case '@set': {
                    if (!(0, istype_1.isString)(rest[0])) {
                        throw new execerror_1.ExecError('Expected key name to be a string', ctx.lineNum);
                    }
                    const key = (rest[0] || '');
                    state[key] = rest[1];
                    break;
                }
            }
        }
        else if (ch === '$') {
            // Set state item.
            const key = command.replace(/^\$/, '');
            state[key] = rest[0];
        }
        else {
            // Call the evaluator.
            try {
                await evaluator(ctx, command, ...rest);
            }
            catch (err) {
                throw new execerror_1.ExecError(err.message, ctx.lineNum, err);
            }
        }
    }
    return { state };
}
exports.execCompiled = execCompiled;
//# sourceMappingURL=exec.js.map