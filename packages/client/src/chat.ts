import type { DEFAULT_SETTINGS } from './consts';
import { MessageType } from './enums';
import type { CommandSuggestion } from './interfaces';
import { WindowService, EventService, MessageHistoryService, SettingsService } from './services';

export class Chat {
    private static readonly instance = new Chat();

    public static getInstance() {
        return Chat.instance;
    }

    private constructor(
        private readonly eventService = EventService.getInstance(),
        private readonly messageHistoryService = MessageHistoryService.getInstance(),
        private readonly settingsService = SettingsService.getInstance(),
        private readonly windowService = WindowService.getInstance(),
    ) {}

    public start() {
        this.eventService.onServer('vchat:toggleFocus', this.toggleWindowFocus.bind(this));
        this.eventService.onServer('vchat:toggleFocusEnabled', this.toggleWindowFocusEnabled.bind(this));
        this.eventService.onServer('vchat:addMessage', this.addMessageToWindow.bind(this));
        this.eventService.onServer('vchat:addSuggestion', this.addSuggestionToWindow.bind(this));
        this.eventService.onServer('vchat:clearMessages', this.clearWindowMessages.bind(this));
        this.eventService.onServer('vchat:clearMessageHistory', this.clearMessageHistory.bind(this));
        // Server -> [Client] => Window
        this.eventService.onServer('vchat:syncSettings', this.syncSettings.bind(this));

        this.eventService.on('keyup', this.toggleWindowFoucsOnKey.bind(this));

        // Server <= [Client] <- Window
        this.eventService.onWindow('vchat:requestSettings', this.requestSettings.bind(this));
        // Server <= [Client] <- Window
        this.eventService.onWindow('vchat:mounted', this.markAsMounted.bind(this));
        this.eventService.onWindow('vchat:addMessage', this.sendMessageToServer.bind(this));
    }

    public toggleWindowFocus(enabled: boolean) {
        this.windowService.toggleFocus(enabled);
    }

    public toggleWindowFocusEnabled(enabled: boolean) {
        this.windowService.toggleFocusEnabled(enabled);
    }

    public addMessageToWindow(message: string, type: MessageType = MessageType.Default) {
        this.messageHistoryService.add({ content: message, type });
        this.windowService.addMessage(message, type);
    }

    public addSuggestionToWindow(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        this.windowService.addSuggestion(suggestion);
    }

    public clearWindowMessages() {
        this.windowService.clearMessages();
    }

    public clearMessageHistory() {
        this.messageHistoryService.clear();
    }

    public syncSettings(settings: typeof DEFAULT_SETTINGS) {
        this.settingsService.update(settings);
        this.windowService.syncSettings(settings);
    }

    public toggleWindowFoucsOnKey(key: number) {
        if (this.settingsService.get('unfocusKey') === key) this.windowService.unfocus();
        else if (this.settingsService.get('focusKey') === key) this.windowService.focus();
    }

    public requestSettings() {
        this.windowService.loadMessageHistory(this.messageHistoryService.get());
        this.eventService.emitServer('vchat:requestSettings');
    }

    public markAsMounted() {
        this.windowService.show();
        this.eventService.emitServer('vchat:mounted', true);
    }

    public sendMessageToServer(message: string) {
        if (message.length > 0) this.eventService.emitServer('vchat:sendMessage', message);
        this.windowService.unfocus();
    }
}
