import { Command } from './commands';
import { AwatedIterable } from './utilities/iter';
export declare type ParseOptions = {
    validateNow?: boolean;
};
export interface Parsed {
    rows: AsyncIterable<Command>;
}
export declare function parseText(input: string, options?: ParseOptions): Promise<Parsed>;
export declare function parseIterable(input: AwatedIterable<string>, options?: ParseOptions): Promise<Parsed>;
