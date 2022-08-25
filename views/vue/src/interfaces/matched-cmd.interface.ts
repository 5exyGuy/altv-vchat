import type { CommandSuggestion } from './cmd-suggestion.interface';

export interface MatchedCommand extends CommandSuggestion {
    currentParam: number;
}
