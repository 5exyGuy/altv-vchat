import { Player } from 'alt-server';
import { container } from 'tsyringe';
import { WindowService } from '../services/window.service';

/**
 * Mutes the player from sending messages.
 */
export function mutePlayer(player: Player) {
    container.resolve(WindowService).mute(player);
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
    container.resolve(WindowService).unmute(player);
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
    return container.resolve(WindowService).isMuted(player);
}
