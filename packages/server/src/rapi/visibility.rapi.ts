import { Player } from 'alt-server';
import { MountService } from '../services/mount.service';
import { WindowService } from '../services/window.service';

/**
 * Shows the chat window for the given player.
 * @param player
 */
export function show(player: Player) {
    MountService.getInstance().waitForMount(player, WindowService.getInstance().show(player));
}

/**
 * Shows the chat window for all players.
 */
export function showAll() {
    Player.all.forEach((player) => show(player));
}

/**
 * Hides the chat window for the given player.
 * @param player
 */
export function hide(player: Player) {
    MountService.getInstance().waitForMount(player, WindowService.getInstance().hide(player));
}

/**
 * Hides the chat window for all players.
 */
export function hideAll() {
    Player.all.forEach((player) => hide(player));
}
