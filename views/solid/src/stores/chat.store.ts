import { createRoot, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

function createChatStore() {
    const [focus, setFocus] = createSignal(false);
    const [message, setMessage] = createSignal('');
    const [options, setOptions] = createStore({
        scrollStep: 20,
        placeholder: 'Type a message...',
        prefix: '/',
        maxBufferLength: 100,
        maxSuggestions: 3,
    });

    return { focus, setFocus, message, setMessage, options, setOptions };
}

export const chatStore = createRoot(createChatStore);
