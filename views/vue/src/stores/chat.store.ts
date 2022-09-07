import { reactive, ref } from 'vue';
import type { Options } from '../interfaces';

const focus = ref(false);
const message = ref('');
const options = reactive({
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
            focus.value = value;
        },
        setMessage(value: string) {
            message.value = value;
        },
        setOptions(value: Options) {
            Object.assign(options, value);
        },
    };
}
