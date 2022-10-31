import { AwatedIterable } from "./utilities/iter";
import { JsonValue } from "./utilities/json";


export type SleepyState<T=unknown> = {
    [key:string]: T,
}

export type SleepyContext = {
    callCount: number,
}

export type Evaluator = (ctx:SleepyContext, state:SleepyState, command:string, ...args:JsonValue[]) => Awaited<void>;

export async function execIterable(input: AwatedIterable<string>, evaluator:Evaluator): Promise<{ state: SleepyState }> {
    const ctx:SleepyContext = {
        callCount: 0,
    };
    const state:SleepyState = {};
    for await (const item of input) {
        const [ command, ...rest ] = item[0];
        await evaluator(ctx, state, command, ...rest);
        ctx.callCount += 1;
    }
    return { state };
}