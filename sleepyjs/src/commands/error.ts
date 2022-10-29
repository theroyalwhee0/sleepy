import { Command, CommandType } from '.';
import { JsonValue } from '../utilities/json';

export class ErrorCommand extends Command {
    error: string;
    message = '';
    type = CommandType.Error;
    line = 0;

    constructor(error:string, message?:string, line?:number) {
        super();
        if(error !== undefined) {
            this.error = error;
        }
        if(message !== undefined) {
            this.message = message;
        }
        if(line !== undefined) {
            this.line = line+1;
        }
    }

    toJSON(): JsonValue[] {
        if (this.message) {
            return [this.type, this.error, this.message];
        } else {
            return [this.type, this.error];
        }
    }
}

export class SyntaxErrorCommand extends ErrorCommand {
    constructor(message?:string, line?:number) {
        super('syntax', message, line);
    }
}

export class ParseErrorCommand extends ErrorCommand {
    constructor(err?: Error, line?: number) {
        super('parse', 'Unable to parse command', line);
        if (err?.message) {
            this.message = err.message.replace(/\s?JSON\s?/, ' ');
        }
    }
}
