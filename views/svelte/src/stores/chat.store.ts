import { writable } from 'svelte/store';

const focus = writable(false);
const message = writable('');
const options = writable({
    scrollStep: 20,
    inputPlaceholder: 'Type a message...',
    cmdPrefix: '/',
    maxMessageBufferLength: 100,
    maxCmdSuggestions: 3,
});

export function useChatStore() {
    return {
        focus,
        message,
        options,
    };
}
