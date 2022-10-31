import { AwatedIterable } from './utilities/iter';
import { JsonValue } from './utilities/json';


export type SleepyState<T = unknown> = {
    [key: string]: T,
}

export type SleepyContext = {
    callCount: number,
}

export type Evaluator<TState extends SleepyState = SleepyState> = (
    ctx: SleepyContext,
    state: TState,
    command: string,
    ...args: JsonValue[]
) => Awaited<void>;

export async function execIterable<TState extends SleepyState>(
    input: AwatedIterable<string>,
    evaluator: Evaluator<TState>
): Promise<{ state: TState }> {
    const ctx: SleepyContext = {
        callCount: 0,
    };
    const state: TState = {} as TState;
    for await (const item of input) {
        const [command, ...rest] = JSON.parse(item);
        const ch = command[0] || '';
        if (ch === '@') {
            // Ignore language commands.
            continue;
        } else if (ch === '$') {
            // Set state item.
            const key: keyof TState = command.replace(/^\$/, '');
            state[key] = rest[0];
        } else {
            // Call the evaluator.
            await evaluator(ctx, state, command, ...rest);
        }
        ctx.callCount += 1;
    }
    return { state };
}