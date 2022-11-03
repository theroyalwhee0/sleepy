import { SleepyError } from './sleepyerror';

export class ParseError extends SleepyError {
    constructor(message: string, lineNum = 0, cause?: Error) {
        super(message);
        this.parent = cause;
        this.lineNum = lineNum;
        if (cause instanceof Error && cause.name === 'SyntaxError') {
            this.details = cause.message.replace(/\bJSON\s+\b/, '');
        }
    }
}