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
