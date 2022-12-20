import type { CommandSuggestion } from '@altv-vchat/shared';

export function validateCommandSuggestion(suggestion: CommandSuggestion) {
    if (typeof suggestion !== 'object') return false;
    if (!suggestion.name || typeof suggestion.name !== 'string') return false;
    if (suggestion.description && typeof suggestion.description !== 'string') return false;
    if (suggestion.parameters && !Array.isArray(suggestion.parameters)) return false;

    if (suggestion.parameters) {
        for (const param of suggestion.parameters) {
            if (!param.name || typeof param.name !== 'string') return false;
            if (param.description && typeof param.description !== 'string') return false;
        }
    }

    return true;
}
