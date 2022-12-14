import { Player } from 'alt-server';
import { MessageType } from '@altv-vchat/shared';
import { DEFAULT_MESSAGE_PROCESSOR } from './consts';
import { CommandService, EventService, LoggerService, MountService, OptionsService, WindowService } from './services';
import type { MessageHandler } from './types';
import { singleton } from 'tsyringe';

@singleton()
export class Chat {
    private messageProcessor: typeof DEFAULT_MESSAGE_PROCESSOR | undefined = DEFAULT_MESSAGE_PROCESSOR;
    private messsageHandler: MessageHandler | undefined = this.handleMessage;

    public constructor(
        private readonly mountService: MountService,
        private readonly windowService: WindowService,
        private readonly commandService: CommandService,
        private readonly eventService: EventService,
        private readonly loggerService: LoggerService,
        private readonly optionsService: OptionsService,
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
                if (this.optionsService.getOption('logPlayerCommands'))
                    this.loggerService.log(`[command] ${player.name}: ${message}`);

                let args = words.split(' ');
                let cmdName = args.shift() ?? '';

                const invoked = this.commandService.invoke(player, cmdName, args);
                if (invoked) return;
                const unknownCommandMessage = this.optionsService
                    .getOption('unknownCommandMessage')
                    .replace('{0}', cmdName);
                this.mountService.waitForMount(
                    player,
                    this.windowService.send(player, unknownCommandMessage, MessageType.Error),
                );
            }
        } else {
            if (this.windowService.isMuted(player)) {
                const muteMessage = this.optionsService.getOption('muteMessage');
                this.mountService.waitForMount(player, this.windowService.send(player, muteMessage, MessageType.Error));
                return;
            }

            if (this.optionsService.getOption('logPlayerMessages'))
                this.loggerService.log(`[message] ${player.name}: ${message}`);
            if (!this.optionsService.getOption('enableHTMLInjections'))
                message = message.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34');
            if (this.messageProcessor && this.optionsService.getOption('enableDefaultMessageFormatter'))
                message = this.processMessage(`<b>${player.name}:</b> ${message}`);

            Player.all.forEach((player) =>
                this.mountService.waitForMount(player, this.windowService.send(player, message)),
            );
        }
    }

    private onChatMessage(player: Player, message: string) {
        if (!this.messsageHandler) return;
        this.messsageHandler(player, message);
    }

    private syncSettings(player: Player) {
        this.eventService.emitClient(
            player,
            'vchat:syncSettings',
            this.optionsService.getClientOptions(),
            this.optionsService.getCommandSuggestions(),
        );
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

    public processMessage(message: string) {
        if (!this.messageProcessor) return message;

        this.optionsService.getEmojis().forEach((emoji) => {
            const escapedName = emoji.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const escapedTextEquivalent = emoji.textEquivalent.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`(:${escapedName}:|${escapedTextEquivalent})`, 'g');
            const src = this.optionsService
                .getOption('emojiCDN')
                .replace('{0}', emoji.name)
                .replace('{1}', emoji.fileFormat);
            message = message.replace(
                regex,
                `<img src="${src}" alt="${emoji.name}" width="24" height="24" style="display: inline-block;" />`,
            );
        });

        return this.messageProcessor(message);
    }

    public setMessageHandler(messageHandler: MessageHandler | undefined) {
        this.messsageHandler = messageHandler;
    }

    public restoreMessageHandler() {
        this.messsageHandler = this.handleMessage;
    }
}
