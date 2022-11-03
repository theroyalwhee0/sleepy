import { SleepyError } from './sleepyerror';
export declare class ExecError extends SleepyError {
    constructor(message?: string, lineNum?: number, cause?: Error);
}
