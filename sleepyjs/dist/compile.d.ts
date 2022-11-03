import { Parsed } from './parse';
import { AwatedIterable } from './utilities/iter';
import { JsonValue } from './utilities/json';
export declare type CompileOptions = {
    source?: string;
    optimize?: boolean;
    info?: boolean;
    validateNow?: boolean;
};
export declare const sleepy_version: number[];
export declare type CompiledRow = JsonValue[];
export interface Compiled {
    rows: AsyncIterable<CompiledRow>;
}
export declare function compileText(input: string, options?: CompileOptions): Promise<Compiled>;
export declare function compileIterable(input: AwatedIterable<string>, options?: CompileOptions): Promise<Compiled>;
export declare function compileParsed(parsed: Parsed, options?: CompileOptions): Promise<Compiled>;
