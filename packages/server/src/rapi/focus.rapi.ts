import { Player } from 'alt-server';
import { WindowService } from '../services/window.service';

/**
 * Toggles the player's chat focus activation.
 */
export function toggleFocusEnabled(player: Player, enabled: boolean) {
    WindowService.getInstance().toggleFocusEnabled(player, enabled);
}

/**
 * Toggles all players' chat focus activation.
 */
export function toggleFocusEnabledAll(enabled: boolean) {
    Player.all.forEach((player) => toggleFocusEnabled(player, enabled));
}

/**
 * Focuses the player's chat.
 */
export function focus(player: Player) {
    WindowService.getInstance().focus(player);
}

/**
 * Focus all players' chat.
 */
export function focusAll() {
    Player.all.forEach((player) => focus(player));
}

/**
 * Unfocuses the player's chat.
 */
export function unfocus(player: Player) {
    WindowService.getInstance().unfocus(player);
}

/**
 * Unfocuses all players' chat.
 */
export function unfocusAll() {
    Player.all.forEach((player) => unfocus(player));
}
