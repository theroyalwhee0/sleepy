"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStream = exports.parseText = void 0;
const node_stream_1 = require("node:stream");
const readline = __importStar(require("node:readline"));
const all_1 = require("./commands/all");
const istype_1 = require("@theroyalwhee0/istype");
const commands_1 = require("./commands");
async function parseText(input) {
    const stream = new node_stream_1.Readable();
    stream.push(input);
    stream.push(null);
    stream.toString = () => {
        return input;
    };
    return parseStream(stream);
}
exports.parseText = parseText;
async function parseStream(input) {
    const rl = readline.createInterface({ input });
    const result = {
        parsed: [],
    };
    let count = 0;
    for await (const content of rl) {
        let cmd = undefined;
        if (all_1.BlankCommand.is(content)) {
            cmd = new all_1.BlankCommand();
        }
        else if (all_1.CommentCommand.is(content)) {
            cmd = new all_1.CommentCommand();
        }
        else if (all_1.Command.is(content)) {
            const text = content.replace(/,$/, '');
            let data;
            try {
                data = JSON.parse(text);
            }
            catch (err) {
                if (err instanceof Error && err.name === 'SyntaxError') {
                    // If JSON Parse Syntax Error...
                    cmd = new all_1.ParseErrorCommand(err, content, count);
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
        cmd.content = content;
        result.parsed.push(cmd);
    }
    return result;
}
exports.parseStream = parseStream;
//# sourceMappingURL=parse.js.map