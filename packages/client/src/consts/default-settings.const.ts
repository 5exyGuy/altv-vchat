import type { ClientOptions, WindowOptions } from '../interfaces';

export const DEFAULT_SETTINGS: ClientOptions & WindowOptions = {
    focusKey: 84,
    hideOnConnect: false,
    maxCommandSuggestions: 3,
    maxMessageBufferLength: 100,
    maxMessageHistory: 100,
    maxMessageLength: 100,
    maxMessages: 100,
    placeholder: 'Type a message...',
    prefix: '/',
    scrollStep: 20,
    unfocusKey: 27,
};
