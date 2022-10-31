import { CommandType } from '@theroyalwhee0/sleepyjs/dist/commands';
import { ErrorCommand } from '@theroyalwhee0/sleepyjs/dist/commands/error';
import { getArgv } from './argv';
import { parseFile } from './parse';

export async function main() {
    const argv = getArgv();
    const parsed = await parseFile(argv.source);
    // const compiled = await compileFile(argv.source);
    const hasErrors = parsed.rows.some((value) => value.type === CommandType.Error);
    if (hasErrors) {
        console.error(`Sleepy Script "${argv.source}" has errors.`);
        for (const error of parsed.rows) {
            if (error instanceof ErrorCommand) {
                console.error(`* line ${error.line}, ${error.error} error: \`\`\`${error.content ?? ''}\`\`\``);
            }
        }
        process.exit(1);
    }
    // await outputCompiled(argv.target, compiled);
}
