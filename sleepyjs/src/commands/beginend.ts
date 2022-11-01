import { Command, CommandType } from './command';

export class EndCommand extends Command {
    type = CommandType.End;
}

export class BeginCommand extends Command {
    type = CommandType.Begin;
}
