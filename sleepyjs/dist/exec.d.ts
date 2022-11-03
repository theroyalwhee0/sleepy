import { Compiled } from './compile';
import { JsonValue } from './utilities/json';
export declare type SleepyState = {
    [key: string]: JsonValue;
};
export declare type SleepyContext<TState extends SleepyState = SleepyState> = {
    lineNum: number;
    state: TState;
};
export declare type Evaluator<TState extends SleepyState = SleepyState> = (ctx: SleepyContext<TState>, command: string, ...args: JsonValue[]) => Awaited<void>;
export declare function execCompiled<TState extends SleepyState = SleepyState>(compiled: Compiled, evaluator: Evaluator<TState>): Promise<{
    state: TState;
}>;
