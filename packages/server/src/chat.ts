import type { Player } from 'alt-server';
import { DEFAULT_MESSAGE_PROCESSOR } from './consts';
import { MessageType } from './enums';
import { MountService } from './services/mount.service';
import { WindowService } from './services/window.service';
import { CommandService } from './services/command.service';
import { EventService } from './services/event.service';
import { LoggerService } from './services/logger.service';
import { SettingsService } from './services/settings.service';
import type { MessageHandler } from './types';

export class Chat {
    private static readonly instance = new Chat();

    public static getInstance() {
        return Chat.instance;
    }

    private messageProcessor: typeof DEFAULT_MESSAGE_PROCESSOR | undefined = DEFAULT_MESSAGE_PROCESSOR;
    private messsageHandler: MessageHandler | undefined = this.handleMessage;

    public constructor(
        private readonly mountService: MountService = MountService.getInstance(),
        private readonly windowService: WindowService = WindowService.getInstance(),
        private readonly commandService: CommandService = CommandService.getInstance(),
        private readonly eventService: EventService = EventService.getInstance(),
        private readonly loggerService: LoggerService = LoggerService.getInstance(),
        private readonly settingsService: SettingsService = SettingsService.getInstance(),
    ) {}

    public start() {
        this.eventService.onClient('vchat:sendMessage', this.onChatMessage.bind(this));
        this.eventService.onClient('vchat:requestSettings', this.syncSettings.bind(this));
        this.eventService.onClient('vchat:mounted', this.onChatMounted.bind(this));
        this.eventService.on('playerDisconnect', this.onPlayerDisconnect.bind(this));
    }

    private handleMessage(player: Player, message: string) {
        if (typeof message !== 'string') return;

        message = message.trim();

        if (message.length === 0) return;
        else if (message.startsWith('/')) {
            const words = message.slice(1);

            if (words.length > 0) {
                if (this.settingsService.get('logPlayerCommands'))
                    this.loggerService.log(`[command] ${player.name}: ${message}`);

                let args = words.split(' ');
                let cmdName = args.shift() ?? '';

                const invoked = this.commandService.invoke(player, cmdName, args);
                if (!invoked) this.windowService.send(player, `Unknown command ${message}`, MessageType.Error);
            }
        } else {
            if (this.windowService.isMuted(player)) {
                this.windowService.send(player, 'You are currently muted.', MessageType.Error);
                return;
            }

            if (this.settingsService.get('logPlayerMessages'))
                this.loggerService.log(`[message] ${player.name}: ${message}`);
            if (!this.settingsService.get('enableHTMLInjections'))
                message = message.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34');
            if (this.messageProcessor && this.settingsService.get('enableDefaultMessageProcessor'))
                message = this.messageProcessor(`<b>${player.name}:</b> ${message}`);
            this.windowService.broadcast(message);
        }
    }

    private onChatMessage(player: Player, message: string) {
        if (!this.messsageHandler) return;
        this.messsageHandler(player, message);
    }

    private syncSettings(player: Player) {
        this.eventService.emitClient(player, 'vchat:syncSettings', this.settingsService.getClient());
    }

    private onChatMounted(player: Player, mounted: boolean) {
        mounted ? this.mountService.markAsMounted(player) : this.mountService.markAsUnmounted(player);
    }

    private onPlayerDisconnect(player: Player) {
        this.mountService.markAsUnmounted(player);
    }

    public setMessageProcessor(messageProcessor: typeof DEFAULT_MESSAGE_PROCESSOR | undefined) {
        this.messageProcessor = messageProcessor;
    }

    public restoreMessageProcessor() {
        this.messageProcessor = DEFAULT_MESSAGE_PROCESSOR;
    }

    public setMessageHandler(messageHandler: MessageHandler | undefined) {
        this.messsageHandler = messageHandler;
    }

    public restoreMessageHandler() {
        this.messsageHandler = this.handleMessage;
    }
}
