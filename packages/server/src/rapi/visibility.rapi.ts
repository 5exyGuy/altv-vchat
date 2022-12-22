import { Player } from 'alt-server';
import { container } from 'tsyringe';
import { MountService } from '../services/mount.service';
import { WindowService } from '../services/window.service';

/**
 * Shows the chat window for the given player.
 */
export function show(player: Player) {
    container.resolve(MountService).waitForMount(player, container.resolve(WindowService).show(player));
}

/**
 * Shows the chat window for all players.
 */
export function showAll() {
    Player.all.forEach((player) => show(player));
}

/**
 * Hides the chat window for the given player.
 */
export function hide(player: Player) {
    container.resolve(MountService).waitForMount(player, container.resolve(WindowService).hide(player));
}

/**
 * Hides the chat window for all players.
 */
export function hideAll() {
    Player.all.forEach((player) => hide(player));
}
