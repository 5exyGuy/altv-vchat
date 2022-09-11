<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import { useChatStore } from '../stores';

// --------------------------------------------------------------
// Chat Store
// --------------------------------------------------------------

const { focus, message, setMessage, options } = useChatStore();

// --------------------------------------------------------------
// Local Variables
// --------------------------------------------------------------

const buffer: Ref<Array<string>> = ref([]);
const currentBufferIndex: Ref<number> = ref(-1);
const previousMessage: Ref<string> = ref('');

// --------------------------------------------------------------
// Refs
// --------------------------------------------------------------

const inputRef = ref<HTMLInputElement>();

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

// Sending messages ---------------------------------------------

/**
 * Sends the message to the server if ENTER is pressed.
 * @param event The keyborad event.
 */
async function sendMessage(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;

    window?.alt?.emit('vchat:addMessage', message.value.trim());
    buffer.value = [message.value, ...buffer.value].splice(0, options.maxMessageBufferLength);
    currentBufferIndex.value = -1;
    setMessage('');

    event.preventDefault();
}

// Message buffer -----------------------------------------------

/**
 * Selects the previous message in the buffer depending on the key pressed.
 * @param event The keyboard event.
 */
function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    if (message.value && message.value.startsWith(options.prefix)) return;
    if (buffer.value.length === 0) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentBufferIndex.value > 0) {
            message.value = buffer.value[--currentBufferIndex.value];
        } else if (currentBufferIndex.value === 0) {
            currentBufferIndex.value = -1;
            message.value = previousMessage.value;
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentBufferIndex.value < 0) previousMessage.value = message.value;
        if (currentBufferIndex.value < buffer.value.length - 1) {
            message.value = buffer.value[++currentBufferIndex.value];
        }
    }

    event.preventDefault();
}

function processInputChange(event: Event) {
    const value = (event.currentTarget as HTMLInputElement).value;
    if (options.maxMessageLength !== 0 && value.length > options.maxMessageLength) {
        setMessage(value.slice(0, options.maxMessageLength));
        return;
    }
    setMessage(value);
}

// --------------------------------------------------------------
// Hooks
// --------------------------------------------------------------

// Effects ------------------------------------------------------

// Listens to options changes.
watch(options, (options) => {
    if (message.value.length > options.maxMessageLength) setMessage(message.value.slice(0, options.maxMessageLength));
    if (buffer.value.length > options.maxMessageBufferLength) {
        buffer.value = buffer.value.slice(0, options.maxMessageBufferLength);
        currentBufferIndex.value = -1;
    }
});

// Listens to focus changes.
// When focus is true, the input is focused.
// When focus is false, sets the current message buffer index to -1.
watch(focus, async (focus) => {
    if (focus) {
        await nextTick();
        inputRef.value?.focus();
    } else currentBufferIndex.value = -1;
});

// Mount --------------------------------------------------------

onMounted(() => window.addEventListener('keydown', handleKeydown));

// Unmount ------------------------------------------------------

onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
    <div
        class="flex gap-4 bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] w-full"
        :class="{ invisible: !focus, visible: focus }"
    >
        <input
            class="bg-transparent focus:outline-none w-full"
            :placeholder="options.placeholder"
            v-model="message"
            ref="inputRef"
            @input="processInputChange"
            @keydown="sendMessage"
            @blur="(event) => (event.target as HTMLInputElement).focus()"
        />
        <span class="text-white text-opacity-50"> {{ message.length }}/{{ options.maxMessageLength }} </span>
    </div>
</template>
