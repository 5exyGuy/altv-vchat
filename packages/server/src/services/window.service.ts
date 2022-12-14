import { emitClientRaw, Player } from 'alt-server';
import { validateMessage } from '../validators';
import { ClientOptions, MessageType, WindowOptions } from '@altv-vchat/shared';
import { singleton } from 'tsyringe';

@singleton()
export class WindowService {
    private readonly mutedPlayers = new Set<Player>();

    public send(player: Player, message: string, type: MessageType = MessageType.Default) {
        if (!validateMessage(message, type)) return;
        return () => emitClientRaw(player, 'vchat:addMessage', message, type);
    }

    public show(player: Player) {
        return () => emitClientRaw(player, 'vchat:toggleVisibility', true);
    }

    public hide(player: Player) {
        return () => emitClientRaw(player, 'vchat:toggleVisibility', false);
    }

    public mute(player: Player) {
        this.mutedPlayers.add(player);
    }

    public unmute(player: Player) {
        this.mutedPlayers.delete(player);
    }

    public isMuted(player: Player) {
        return this.mutedPlayers.has(player);
    }

    public toggleFocusEnabled(player: Player, enabled: boolean) {
        return () => emitClientRaw(player, 'vchat:toggleFocusEnabled', enabled);
    }

    public focus(player: Player) {
        return () => emitClientRaw(player, 'vchat:toggleFocus', true);
    }

    public unfocus(player: Player) {
        return () => emitClientRaw(player, 'vchat:toggleFocus', false);
    }

    public clearMessageHistory(player: Player) {
        return () => emitClientRaw(player, 'vchat:clearMessageHistory');
    }

    public clearMessages(player: Player) {
        return () => emitClientRaw(player, 'vchat:clearMessages');
    }

    public updateOption(
        player: Player,
        key: keyof (ClientOptions & WindowOptions),
        value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)],
    ) {
        return () => emitClientRaw(player, 'vchat:updateOption', key, value);
    }

    public updateOptions(player: Player, options: Partial<ClientOptions & WindowOptions>) {
        return () => emitClientRaw(player, 'vchat:updateOptions', options);
    }
}
