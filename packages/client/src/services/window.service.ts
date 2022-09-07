import { toggleGameControls, WebView } from 'alt-client';
import type { DEFAULT_SETTINGS } from '../consts';
import { MessageType } from '../enums';
import type { CommandSuggestion, Message } from '../interfaces';

export class WindowService {
    private static readonly instance = new WindowService();

    public static getInstance() {
        return WindowService.instance;
    }

    // private readonly webView = new WebView('http://resource/client/view/index.html');
    private readonly webView = new WebView('http://localhost:4000');
    private focusEnabled = true;

    private constructor() {
        this.webView.isVisible = false;
    }

    public focus() {
        if (!this.webView.isVisible || !this.focusEnabled) return;

        this.webView.emit('vchat:focus', true);
        this.webView.focus();
        toggleGameControls(false);
    }

    public unfocus() {
        if (!this.webView.isVisible || !this.focusEnabled) return;

        this.webView.emit('vchat:focus', false);
        this.webView.unfocus();
        toggleGameControls(true);
    }

    public toggleFocus(value: boolean) {
        value ? this.focus() : this.unfocus();
    }

    public toggleFocusEnabled(enabled: boolean) {
        this.focusEnabled = enabled;
        if (!enabled) this.unfocus();
    }

    public show() {
        this.webView.isVisible = true;
    }

    public hide() {
        this.webView.isVisible = false;
    }

    public addMessage(message: string, type: MessageType = MessageType.Default) {
        this.webView.emit('vchat:addMessage', message, type);
    }

    public loadMessageHistory(messages: Array<Message>) {
        this.webView.emit('vchat:loadMessageHistory', messages);
    }

    public clearMessages() {
        this.webView.emit('vchat:clearMessages');
    }

    public addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        this.webView.emit('vchat:addSuggestion', suggestion);
    }

    public syncSettings(settings: typeof DEFAULT_SETTINGS) {
        const {
            prefix,
            placeholder,
            maxCommandSuggestions,
            maxMessageLength,
            maxMessages,
            maxMessageBufferLength,
            scrollStep,
        } = settings;
        this.webView.emit('vchat:syncSettings', {
            prefix,
            placeholder,
            maxCommandSuggestions,
            maxMessageLength,
            maxMessages,
            maxMessageBufferLength,
            scrollStep,
        });
    }

    public updateSettings(settings: typeof DEFAULT_SETTINGS) {
        const {
            prefix,
            placeholder,
            maxCommandSuggestions,
            maxMessageLength,
            maxMessages,
            maxMessageBufferLength,
            scrollStep,
        } = settings;
        this.webView.emit('vchat:updateSettings', {
            prefix,
            placeholder,
            maxCommandSuggestions,
            maxMessageLength,
            maxMessages,
            maxMessageBufferLength,
            scrollStep,
        });
    }

    public on(event: string, listener: (...args: any[]) => void) {
        this.webView.on(event, listener);
    }
}
