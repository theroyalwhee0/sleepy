import { isString } from '@theroyalwhee0/istype';
import { Compiled } from './compile';
import { ExecError } from './errors/execerror';
import { JsonValue } from './utilities/json';


export type SleepyState = {
    [key: string]: JsonValue,
}

export type SleepyContext<TState extends SleepyState = SleepyState> = {
    lineNum: number,
    state: TState,
}

export type Evaluator<TState extends SleepyState = SleepyState> = (
    ctx: SleepyContext<TState>,
    command: string,
    ...args: JsonValue[]
) => Awaited<void>;


export async function execCompiled<TState extends SleepyState = SleepyState>(
    compiled: Compiled,
    evaluator: Evaluator<TState>
): Promise<{ state: TState }> {
    const state: TState = {} as TState;
    const ctx: SleepyContext<TState> = {
        lineNum: 0,
        state,
    };
    for await (const item of compiled.rows()) {
        ctx.lineNum += 1;
        if (item.length === 0) {
            throw new ExecError('Expected row to have a command name', ctx.lineNum);
        }
        const [command, ...rest] = item;
        if (!isString(command)) {
            throw new ExecError('Expected command name to be a string', ctx.lineNum);
        }
        const ch = command[0] || '';
        if (ch === '@') {
            // Ignore language commands.
            switch (command) {
                case '@set': {
                    if (!isString(rest[0])) {
                        throw new ExecError('Expected key name to be a string', ctx.lineNum);
                    }
                    const key = (rest[0] || '');
                    (state as SleepyState)[key] = rest[1];
                    break;
                }
            }
        } else if (ch === '$') {
            // Set state item.
            const key = command.replace(/^\$/, '');
            (state as SleepyState)[key] = rest[0];
        } else {
            // Call the evaluator.
            try {
                await evaluator(ctx, command, ...rest);
            } catch (err) {
                throw new ExecError(err.message, ctx.lineNum, err);
            }
        }
    }
    return { state };
}
