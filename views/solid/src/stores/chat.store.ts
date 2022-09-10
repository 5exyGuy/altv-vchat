import { createRoot, createSignal } from 'solid-js';
import type { CommandSuggestion } from '../interfaces';

function createChatStore() {
    const [focus, setFocus] = createSignal<boolean>(false);
    const [message, setMessage] = createSignal<string>('');
    const [commandSuggestions, setCommandSuggestions] = createSignal<Array<CommandSuggestion>>([]);
    const [options, setOptions] = createSignal({
        prefix: '/',
        placeholder: 'Type a message...',
        maxCommandSuggestions: 3,
        maxMessageLength: 100,
        maxMessages: 100,
        maxMessageBufferLength: 100,
        scrollStep: 20,
    });

    return { focus, setFocus, message, setMessage, commandSuggestions, setCommandSuggestions, options, setOptions };
}

export const chatStore = createRoot(createChatStore);
