"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const commands_1 = require("@theroyalwhee0/sleepyjs/dist/commands");
const error_1 = require("@theroyalwhee0/sleepyjs/dist/commands/error");
const argv_1 = require("./argv");
const parse_1 = require("./parse");
async function main() {
    const argv = (0, argv_1.getArgv)();
    const parsed = await (0, parse_1.parseFile)(argv.source);
    // const compiled = await compileFile(argv.source);
    const hasErrors = parsed.rows.some((value) => value.type === commands_1.CommandType.Error);
    if (hasErrors) {
        console.error(`Sleepy Script "${argv.source}" has errors.`);
        for (const error of parsed.rows) {
            if (error instanceof error_1.ErrorCommand) {
                console.error(`* line ${error.line}, ${error.error} error: \`\`\`${error.content ?? ''}\`\`\``);
            }
        }
        process.exit(1);
    }
    // await outputCompiled(argv.target, compiled);
}
exports.main = main;
//# sourceMappingURL=main.js.map