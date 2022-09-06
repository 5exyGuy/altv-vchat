import type { Player } from 'alt-server';
import { WindowService } from '../services/window.service';

/**
 * Shows the chat window for the given player.
 * @param player
 */
export function show(player: Player) {
    WindowService.getInstance().show(player);
}

/**
 * Hide the chat window for the given player.
 * @param player
 */
export function hide(player: Player) {
    WindowService.getInstance().hide(player);
}
