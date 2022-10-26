import { Command, CommandType } from '.';

export class EndCommand extends Command {
    type = CommandType.End;
}

export class BeginCommand extends Command {
    type = CommandType.Begin;
}
