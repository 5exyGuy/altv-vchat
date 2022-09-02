import { createRoot, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

function createChatStore() {
    const [focus, setFocus] = createSignal(false);
    const [message, setMessage] = createSignal('');
    const [options, setOptions] = createStore({
        prefix: '/',
        placeholder: 'Type a message...',
        maxCommandSuggestions: 3,
        maxMessageLength: 100,
        maxMessages: 100,
        maxMessageBufferLength: 100,
        scrollStep: 20,
    });

    return { focus, setFocus, message, setMessage, options, setOptions };
}

export const chatStore = createRoot(createChatStore);
