import type { Command } from './cmd.interface';

export interface MatchedCommand extends Command {
    currentParam: number;
}
