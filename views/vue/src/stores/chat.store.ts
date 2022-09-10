import { reactive, Ref, ref } from 'vue';
import type { CommandSuggestion, Options } from '../interfaces';

const focus: Ref<boolean> = ref(false);
const message: Ref<string> = ref('');
const commandSuggestions: Ref<Array<CommandSuggestion>> = ref([]);
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
        commandSuggestions,
        options,
        setFocus(value: boolean) {
            focus.value = value;
        },
        setMessage(value: string) {
            message.value = value;
        },
        setCommandSuggestions(value: Array<CommandSuggestion>) {
            commandSuggestions.value = value;
        },
        setOptions(value: Options) {
            Object.assign(options, value);
        },
    };
}
