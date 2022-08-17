import type { Command } from './command.interface';

export interface MatchedCommand extends Command {
    currentParam: number;
}
