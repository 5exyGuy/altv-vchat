import { emitClientRaw, Player } from 'alt-server';
import { MessageType } from '../enums';
import { validateMessage } from '../validators';
import { MountService } from './mount.service';

export class WindowService {
    private static readonly instance = new WindowService();

    public static getInstance() {
        return WindowService.instance;
    }

    private readonly mutedPlayers = new Set<Player>();

    private constructor(private readonly mountService = MountService.getInstance()) {}

    public send(player: Player, message: string, type: MessageType = MessageType.Default) {
        if (!validateMessage(message, type)) return;
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:addMessage', message, type));
    }

    public broadcast(message: string, type: MessageType = MessageType.Default) {
        if (!validateMessage(message, type)) return;
        Player.all.forEach((player) =>
            this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:addMessage', message, type)),
        );
    }

    public show(player: Player) {
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:toggleVisibility', true));
    }

    public hide(player: Player) {
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:toggleVisibility', false));
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
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:toggleFocusEnabled', enabled));
    }

    public focus(player: Player) {
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:toggleFocus', true));
    }

    public unfocus(player: Player) {
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:toggleFocus', false));
    }

    public clearMessageHistory(player: Player) {
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:clearMessageHistory'));
    }

    public clearMessages(player: Player) {
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:clearMessages'));
    }
}
