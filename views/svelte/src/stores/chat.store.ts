import { writable } from 'svelte/store';

const focus = writable(false);
const message = writable('');
const options = writable({
    prefix: '/',
    placeholder: 'Type a message...',
    maxCommandSuggestions: 3,
    maxMessageLength: 100,
    maxMessages: 100,
    maxMessageBufferLength: 100,
    scrollStep: 20,
});

export function useChatStore() {
    return {
        focus,
        message,
        options,
        setFocus(value: boolean) {
            focus.set(value);
        },
        setMessage(value: string) {
            message.set(value);
        },
        setOptions(value: {
            prefix: string;
            placeholder: string;
            maxCommandSuggestions: number;
            maxMessageLength: number;
            maxMessages: number;
            maxMessageBufferLength: number;
            scrollStep: number;
        }) {
            options.set(value);
        },
    };
}
