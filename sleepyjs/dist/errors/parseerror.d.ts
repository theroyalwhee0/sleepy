import { SleepyError } from './sleepyerror';
export declare class ParseError extends SleepyError {
    constructor(message: string, lineNum?: number, cause?: Error);
}
