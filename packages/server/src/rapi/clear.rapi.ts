import { Player } from 'alt-server';
import { container } from 'tsyringe';
import { MountService } from '../services/mount.service';
import { WindowService } from '../services/window.service';

/**
 * Clears the player's chat history from the local storage.
 */
export function clearMessageHistory(player: Player) {
    container.resolve(MountService).waitForMount(player, container.resolve(WindowService).clearMessageHistory(player));
}

/**
 * Clears all players' chat history from the local storage.
 */
export function clearMessageHistoryAll() {
    Player.all.forEach((player) => clearMessageHistory(player));
}

/**
 * Clears the player's chat in the webview.
 */
export function clearMessages(player: Player) {
    container.resolve(MountService).waitForMount(player, container.resolve(WindowService).clearMessages(player));
}

/**
 * Clears all players' chat in the webview.
 */
export function clearMessagesAll() {
    Player.all.forEach((player) => clearMessages(player));
}
