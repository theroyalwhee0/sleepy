import { SleepyError } from './sleepyerror';

export class ParseError extends SleepyError {
    parent: undefined | Error;
    lineNum: number;

    constructor(message: string, lineNum = 0, cause?: Error) {
        super(message);
        this.parent = cause;
        this.lineNum = lineNum;
    }
}