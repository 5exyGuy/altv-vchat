import type { Player } from 'alt-server';
import type { CommandSuggestion } from '@altv-vchat/shared';
import { CommandService } from '../services/command.service';
import { MountService } from '../services/mount.service';
import { container } from 'tsyringe';

/**
 * Adds a command suggestion to the player's chat webview.
 */
export function addSuggestion(player: Player, suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    container
        .resolve(MountService)
        .waitForMount(player, container.resolve(CommandService).addSuggestion(player, suggestion));
}

export function removeSuggestions(player: Player) {
    container.resolve(MountService).waitForMount(player, container.resolve(CommandService).removeSuggestions(player));
}
