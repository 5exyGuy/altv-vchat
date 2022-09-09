import type { Player } from 'alt-server';
import type { CommandSuggestion } from '../interfaces';
import { CommandService } from '../services/command.service';
import { MountService } from '../services/mount.service';

/**
 * Adds a command suggestion to the player's chat webview.
 */
export function addSuggestion(player: Player, suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    MountService.getInstance().waitForMount(player, CommandService.getInstance().addSuggestion(player, suggestion));
}

export function removeSuggestions(player: Player) {
    MountService.getInstance().waitForMount(player, CommandService.getInstance().removeSuggestions(player));
}
