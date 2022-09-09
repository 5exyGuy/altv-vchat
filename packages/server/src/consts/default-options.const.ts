import type { ClientOptions, ServerOptions, WindowOptions } from '../interfaces';

export const DEFAULT_OPTIONS = {
    prefix: '/',
    placeholder: 'Type a message...',
    maxMessages: 100,
    maxMessageHistory: 100,
    maxCommandSuggestions: 3,
    maxMessageLength: 1000,
    hideOnConnect: false,
    enableHTMLInjections: false,
    enableDefaultMessageProcessor: true,
    logPlayerMessages: false,
    logPlayerCommands: false,
    unfocusKey: 27,
    focusKey: 84,
} as ServerOptions & ClientOptions & WindowOptions;
