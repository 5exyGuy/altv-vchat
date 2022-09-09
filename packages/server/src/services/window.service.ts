import { emitClientRaw, Player } from 'alt-server';
import { MessageType } from '../enums';
import type { WindowOptions } from '../interfaces';
import { validateMessage } from '../validators';

export class WindowService {
    private static readonly instance = new WindowService();

    public static getInstance() {
        return WindowService.instance;
    }

    private readonly mutedPlayers = new Set<Player>();

    private constructor() {}

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

    public updateOption(player: Player, key: keyof WindowOptions, value: WindowOptions[keyof WindowOptions]) {
        return () => emitClientRaw(player, 'vchat:updateOption', key, value);
    }

    public updateOptions(player: Player, options: WindowOptions) {
        return () => emitClientRaw(player, 'vchat:updateOptions', options);
    }
}
