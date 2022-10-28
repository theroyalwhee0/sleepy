import { Command } from './commands/all';
import { AwatedIterable } from './utilities/iter';
export interface Parsed {
    rows: Command[];
}
export declare function parseText(input: string): Promise<Parsed>;
export declare function parseIterable(input: AwatedIterable<string>): Promise<Parsed>;
