import { Player } from 'alt-server';
import { MountService } from '../services/mount.service';
import { WindowService } from '../services/window.service';

/**
 * Clears the player's chat history from the local storage.
 */
export function clearMessageHistory(player: Player) {
    MountService.getInstance().waitForMount(player, WindowService.getInstance().clearMessageHistory(player));
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
    MountService.getInstance().waitForMount(player, WindowService.getInstance().clearMessages(player));
}

/**
 * Clears all players' chat in the webview.
 */
export function clearMessagesAll() {
    Player.all.forEach((player) => clearMessages(player));
}
