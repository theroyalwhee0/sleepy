import { Parsed } from './parse';
import { JsonValue } from './utilities/json';
export declare type CompileOptions = {
    source?: string;
    optimize?: boolean;
    info?: boolean;
};
export declare const sleepy_version: number[];
export declare type CompiledRow = JsonValue[];
export interface Compiled {
    rows: CompiledRow[];
}
export declare function compileText(input: string, options?: CompileOptions): Promise<Compiled>;
export declare function compileIterable(input: Iterable<string>, options?: CompileOptions): Promise<Compiled>;
export declare function compileParsed(parsed: Parsed, options?: CompileOptions): Promise<Compiled>;
