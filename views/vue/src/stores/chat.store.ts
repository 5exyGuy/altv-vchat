import { reactive, ref } from 'vue';

const focus = ref(false);
const message = ref('');
const options = reactive({
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
        setFocus(value: boolean) {
            focus.value = value;
        },
        setMessage(value: string) {
            message.value = value;
        },
    };
}
