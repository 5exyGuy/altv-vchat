import { createRoot, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

function createChatStore() {
    const [focus, setFocus] = createSignal(false);
    const [message, setMessage] = createSignal('');
    const [options, setOptions] = createStore({
        scrollStep: 20,
        inputPlaceholder: 'Type a message...',
        cmdPrefix: '/',
        maxMessageBufferLength: 100,
        maxCmdSuggestions: 3,
    });

    return { focus, setFocus, message, setMessage, options, setOptions };
}

export const chatStore = createRoot(createChatStore);
