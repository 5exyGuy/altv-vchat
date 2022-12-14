import { Player } from 'alt-server';
import { MessageType } from '@altv-vchat/shared';
import { MountService } from '../services/mount.service';
import { WindowService } from '../services/window.service';
import { container } from 'tsyringe';
import { OptionsService } from '../services';
import { Chat } from '../chat';

/**
 * Sends a message to the player.
 */
export function send(player: Player, message: string, type: MessageType = MessageType.Default) {
    const useChatFormattingInAPI = container.resolve(OptionsService).getOption('useChatFormattingInAPI');
    if (useChatFormattingInAPI) message = container.resolve(Chat).processMessage(message);

    container.resolve(MountService).waitForMount(player, container.resolve(WindowService).send(player, message, type));
}

/**
 * Sends a message to all players.
 */
export function broadcast(message: string, type: MessageType = MessageType.Default) {
    Player.all.forEach((player) => send(player, message, type));
}
