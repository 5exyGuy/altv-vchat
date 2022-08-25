import { reactive } from 'vue';

export const chatStore = reactive({
    maxSuggestions: 3,
    prefix: '/',
    placeholder: 'Type your message here...',
    message: '',
    focus: false,
});
