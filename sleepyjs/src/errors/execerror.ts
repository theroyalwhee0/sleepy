import { SleepyError } from './sleepyerror';

export class ExecError extends SleepyError {
    constructor(message = 'An error occured during script execution', lineNum = 0, cause?: Error) {
        super(message, lineNum, cause);
    }
}