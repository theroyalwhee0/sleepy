import { JsonValue } from '../utilities/json';
import { Command } from './command';
export declare type UserCommandArgumentItem = JsonValue;
export declare type UserCommandArgs = UserCommandArgumentItem[];
export declare class UserCommand extends Command {
    args?: UserCommandArgs;
    constructor(type: string, args?: UserCommandArgs);
    static create(data: unknown[]): UserCommand;
    toJSON(): JsonValue[];
}
