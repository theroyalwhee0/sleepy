import { isString } from '@theroyalwhee0/istype';
import { JsonValue } from '../utilities/json';

export enum CommandType {
    Noop = '@noop',
    Begin = '@begin',
    End = '@end',
    Error = '@error',
}

export interface ICommand {
    type: string,
    content?: string,
    error?: string,
    toJSON(): JsonValue[]
}

export class Command implements ICommand {
    type: string;
    content?: string;

    static #re_command = /^\s*\[.*\]\s*,?\s*$/;
    static is(value: string): boolean {
        return Command.#re_command.test(value);
    }

    toJSON(): JsonValue[] {
        return [this.type];
    }
}

export type UserCommandArgumentItem = string | number | boolean;
export type UserCommandArgs = UserCommandArgumentItem[];

export class UserCommand extends Command {
    args?: UserCommandArgs;
    constructor(type: string, args: UserCommandArgs = []) {
        super();
        this.type = type;
        if (args.length !== 0) {
            this.args = args;
        }
    }

    static create(data: unknown[]) {
        if (data.length === 0) {
            throw new Error('Expected at least one element in input.');
        }
        if (!isString(data[0])) {
            throw new Error('Expected element 0 of input to be a string');
        }
        const type = '' + data[0];
        const args = data.slice(1) as UserCommandArgs;
        const cmd = new UserCommand(type, args);
        return cmd;
    }

    toJSON(): JsonValue[] {
        return [this.type, ...(this.args ?? [])];
    }
}
