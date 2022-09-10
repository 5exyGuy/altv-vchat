import type { CommandSuggestion, Options } from '../interfaces';
import { writable } from 'svelte/store';

const focus = writable<boolean>(false);
const message = writable<string>('');
const commandSuggestions = writable<Array<CommandSuggestion>>([]);
const options = writable<Options>({
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
        commandSuggestions,
        options,
        setFocus(value: boolean) {
            focus.set(value);
        },
        setMessage(value: string) {
            message.set(value);
        },
        setCommandSuggestions(value: Array<CommandSuggestion>) {
            commandSuggestions.set(value);
        },
        setOptions(value: Options) {
            options.set(value);
        },
    };
}
