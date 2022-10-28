import { Command, CommandType } from '.';

export class ErrorCommand extends Command {
    error: string;
    message = '';
    type = CommandType.Error;
    line = 0;
}

export class SyntaxErrorCommand extends ErrorCommand {
    error = 'syntax';
}

export class ParseErrorCommand extends ErrorCommand {
    error = 'parse';
    message = 'Unable to parse command';
    constructor(err: Error, content: string, line: number) {
        super();
        this.line = line + 1;
        if (err.message) {
            this.message = err.message.replace(/\s?JSON\s?/, ' ');
        }
    }
}
