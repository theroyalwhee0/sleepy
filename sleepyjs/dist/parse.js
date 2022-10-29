"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIterable = exports.parseText = void 0;
const all_1 = require("./commands/all");
const istype_1 = require("@theroyalwhee0/istype");
const commands_1 = require("./commands");
async function parseText(input) {
    const lines = input === '' ? [] : input.split(/\r\n|\n/);
    return parseIterable(lines);
}
exports.parseText = parseText;
async function parseIterable(input) {
    const result = {
        rows: [],
    };
    let count = 0;
    for await (const item of input) {
        let cmd = undefined;
        if (all_1.BlankCommand.is(item)) {
            cmd = new all_1.BlankCommand();
        }
        else if (all_1.CommentCommand.is(item)) {
            cmd = new all_1.CommentCommand();
        }
        else if (all_1.Command.is(item)) {
            const text = item.replace(/,$/, '');
            let data;
            try {
                data = JSON.parse(text);
            }
            catch (err) {
                if (err instanceof Error && err.name === 'SyntaxError') {
                    // If JSON Parse Syntax Error...
                    cmd = new all_1.ParseErrorCommand(err, count);
                }
                else {
                    // Else rethrow...
                    throw err;
                }
            }
            if (!cmd) {
                if ((0, istype_1.isArray)(data)) {
                    if (data.length === 0) {
                        cmd = new all_1.NoopCommand();
                    }
                    else {
                        cmd = commands_1.UserCommand.create(data);
                    }
                }
                else {
                    cmd = new all_1.SyntaxErrorCommand();
                }
            }
        }
        else {
            cmd = new all_1.SyntaxErrorCommand();
        }
        if (!cmd) {
            throw new Error('Expected command to be populated.');
        }
        count += 1;
        cmd.content = item;
        result.rows.push(cmd);
    }
    return result;
}
exports.parseIterable = parseIterable;
//# sourceMappingURL=parse.js.map