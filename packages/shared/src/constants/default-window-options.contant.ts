import type { WindowOptions } from '../interfaces';

export const DefaultWindowOptions: WindowOptions = {
    maxCommandSuggestions: 3,
    maxMessageBufferLength: 100,
    maxMessageLength: 1000,
    maxMessages: 100,
    placeholder: 'Type a message...',
    prefix: '/',
    scrollStep: 20,
};
