import type { Player } from 'alt-server';
import type { CommandSuggestion } from '../interfaces';
import { CommandService } from '../services/command.service';

/**
 * Adds a command suggestion to the player's chat webview.
 */
export function addSuggestion(player: Player, suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    CommandService.getInstance().addSuggestion(player, suggestion);
}
