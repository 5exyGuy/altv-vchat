import { Player } from 'alt-server';
import { MessageType } from '../enums';
import { MountService } from '../services/mount.service';
import { WindowService } from '../services/window.service';

/**
 * Sends a message to the player.
 */
export function send(player: Player, message: string, type: MessageType = MessageType.Default) {
    MountService.getInstance().waitForMount(player, WindowService.getInstance().send(player, message, type));
}

/**
 * Sends a message to all players.
 */
export function broadcast(message: string, type: MessageType = MessageType.Default) {
    Player.all.forEach((player) => send(player, message, type));
}
