import { Player } from 'alt-server';
import { WindowService } from '../services/window.service';

/**
 * Mutes the player from sending messages.
 */
export function mutePlayer(player: Player) {
    WindowService.getInstance().mute(player);
}

/**
 * Mutes all players from sending messages.
 */
export function muteAllPlayers() {
    Player.all.forEach((player) => mutePlayer(player));
}

/**
 * Unmutes the player from sending messages.
 */
export function unmutePlayer(player: Player) {
    WindowService.getInstance().unmute(player);
}

/**
 * Unmutes all players from sending messages.
 */
export function unmuteAllPlayers() {
    Player.all.forEach((player) => unmutePlayer(player));
}

/**
 * Checks if the player is muted.
 */
export function isMuted(player: Player) {
    return WindowService.getInstance().isMuted(player);
}
