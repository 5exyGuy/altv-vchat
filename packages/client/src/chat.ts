import { MessageType } from './enums';
import type { ClientOptions, CommandSuggestion, WindowOptions } from './interfaces';
import { WindowService, EventService, MessageHistoryService, OptionsService } from './services';

export class Chat {
    private static readonly instance = new Chat();

    public static getInstance() {
        return Chat.instance;
    }

    private constructor(
        private readonly eventService = EventService.getInstance(),
        private readonly messageHistoryService = MessageHistoryService.getInstance(),
        private readonly optionsService = OptionsService.getInstance(),
        private readonly windowService = WindowService.getInstance(),
    ) {}

    public start() {
        this.eventService.onServer('vchat:toggleVisibility', this.toggleWindowVisibility.bind(this));
        this.eventService.onServer('vchat:toggleFocus', this.toggleWindowFocus.bind(this));
        this.eventService.onServer('vchat:toggleFocusEnabled', this.toggleWindowFocusEnabled.bind(this));
        this.eventService.onServer('vchat:addMessage', this.addMessageToWindow.bind(this));
        this.eventService.onServer('vchat:addSuggestion', this.addSuggestionToWindow.bind(this));
        this.eventService.onServer(
            'vchat:removeSuggestions',
            this.removeSuggestionsFromWindow.bind(this.windowService),
        );
        this.eventService.onServer('vchat:clearMessages', this.clearWindowMessages.bind(this));
        this.eventService.onServer('vchat:clearMessageHistory', this.clearMessageHistory.bind(this));
        this.eventService.onServer('vchat:syncSettings', this.syncSettings.bind(this));
        this.eventService.onServer('vchat:updateOption', this.updateOption.bind(this));
        this.eventService.onServer('vchat:updateOptions', this.updateOptions.bind(this));

        this.eventService.on('keyup', this.toggleWindowFoucsOnKey.bind(this));

        this.windowService.on('vchat:requestSettings', this.requestSettings.bind(this));
        this.windowService.once('vchat:mounted', this.markAsMounted.bind(this));
        this.windowService.on('vchat:addMessage', this.sendMessageToServer.bind(this));
    }

    public toggleWindowVisibility(enabled: boolean) {
        enabled ? this.windowService.show() : this.windowService.hide();
    }

    public toggleWindowFocus(enabled: boolean) {
        this.windowService.toggleFocus(enabled);
    }

    public toggleWindowFocusEnabled(enabled: boolean) {
        this.windowService.toggleFocusEnabled(enabled);
    }

    public addMessageToWindow(message: string, type: MessageType = MessageType.Default) {
        if (this.messageHistoryService.getLength() > this.optionsService.get('maxMessageHistory'))
            this.messageHistoryService.removeFirst();
        this.messageHistoryService.add({ content: message, type });
        this.windowService.addMessage(message, type);
    }

    public addSuggestionToWindow(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        this.windowService.addSuggestion(suggestion);
    }

    public removeSuggestionsFromWindow() {
        this.windowService.removeSuggestions();
    }

    public clearWindowMessages() {
        this.windowService.clearMessages();
    }

    public clearMessageHistory() {
        this.messageHistoryService.clear();
    }

    public syncSettings(options: ClientOptions & WindowOptions, commandSuggestions: Array<CommandSuggestion>) {
        this.optionsService.update(options);

        this.windowService.syncSettings(this.optionsService.getWindowOptions(), commandSuggestions);
    }

    public updateOption(
        key: keyof ClientOptions & WindowOptions,
        value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)],
    ) {
        this.optionsService.set(key, value);
        this.windowService.updateOptions(this.optionsService.getWindowOptions());
    }

    public updateOptions(options: Partial<ClientOptions & WindowOptions>) {
        this.optionsService.update(options);
        this.windowService.updateOptions(this.optionsService.getWindowOptions());
    }

    public toggleWindowFoucsOnKey(key: number) {
        if (this.optionsService.get('unfocusKey') === key) this.windowService.unfocus();
        else if (this.optionsService.get('focusKey') === key) this.windowService.focus();
    }

    public requestSettings() {
        this.windowService.loadMessageHistory(this.messageHistoryService.get());
        this.eventService.emitServer('vchat:requestSettings');
    }

    public markAsMounted() {
        this.optionsService.get('hideOnConnect') ? this.windowService.hide() : this.windowService.show();
        this.eventService.emitServer('vchat:mounted', true);
    }

    public sendMessageToServer(message: string) {
        if (message.length > 0) this.eventService.emitServer('vchat:sendMessage', message);
        this.windowService.unfocus();
    }
}
