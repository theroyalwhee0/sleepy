import { Command } from './commands/all';
export interface Parsed {
    rows: Command[];
}
export declare function parseText(input: string): Promise<Parsed>;
export declare function parseIterable(input: Iterable<string>): Promise<Parsed>;
