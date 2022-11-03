"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIterable = exports.parseText = void 0;
const istype_1 = require("@theroyalwhee0/istype");
const commands_1 = require("./commands");
const parseerror_1 = require("./errors/parseerror");
const iter_1 = require("./utilities/iter");
async function parseText(input, options) {
    const iter = (0, iter_1.iterateLines)(input);
    return parseIterable(iter, options);
}
exports.parseText = parseText;
async function parseIterable(input, options) {
    async function* generator() {
        let idx = 0;
        for await (const item of input) {
            yield parseSingleCommand(item, idx + 1);
            idx++;
        }
    }
    const iterable = generator();
    const rows = options?.validateNow === true ? await (0, iter_1.bufferIterable)(iterable) : iterable;
    return {
        rows,
    };
}
exports.parseIterable = parseIterable;
function parseSingleCommand(item, lineNum = 0) {
    let cmd = undefined;
    if (commands_1.BlankCommand.is(item)) {
        cmd = new commands_1.BlankCommand();
    }
    else if (commands_1.CommentCommand.is(item)) {
        cmd = new commands_1.CommentCommand();
    }
    else if (commands_1.Command.is(item)) {
        const text = item.replace(/,$/, '');
        let data;
        try {
            data = JSON.parse(text);
        }
        catch (err) {
            throw new parseerror_1.ParseError('Error parsing line', lineNum, err);
        }
        if (!cmd) {
            if ((0, istype_1.isArray)(data)) {
                if (data.length === 0) {
                    cmd = new commands_1.NoopCommand();
                }
                else if ((0, istype_1.isString)(data[0])) {
                    cmd = commands_1.UserCommand.create(data);
                }
                else {
                    throw new parseerror_1.ParseError('Expected command name to be a string', lineNum);
                }
            }
            else {
                throw new parseerror_1.ParseError('Expected command', lineNum);
            }
        }
    }
    else {
        throw new parseerror_1.ParseError('Syntax error', lineNum);
    }
    if (!cmd) {
        throw new parseerror_1.ParseError('Expected command to be populated', lineNum);
    }
    cmd.content = item;
    return cmd;
}
//# sourceMappingURL=parse.js.map