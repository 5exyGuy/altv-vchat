import type { ClientOptions, ServerOptions, WindowOptions } from '../interfaces';

export const DEFAULT_OPTIONS: ServerOptions & ClientOptions & WindowOptions = {
    enableDefaultMessageProcessor: true,
    enableHTMLInjections: false,
    focusKey: 84,
    hideOnConnect: false,
    logPlayerCommands: false,
    logPlayerMessages: false,
    maxCommandSuggestions: 3,
    maxMessageBufferLength: 100,
    maxMessageHistory: 100,
    maxMessageLength: 1000,
    maxMessages: 100,
    muteMessage: 'You are muted.',
    placeholder: 'Type a message...',
    prefix: '/',
    scrollStep: 20,
    unfocusKey: 27,
    unknownCommandMessage: 'Unknown command: {0}',
};
