<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { chatStore } from '../stores';

const buffer = ref([] as Array<string>);
const currentBufferIndex = ref(-1);
const previousMessage = ref('');
const inputRef = ref<HTMLInputElement>();

async function sendMessage(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        event.preventDefault();
        window?.alt?.emit('vchat:message', chatStore.message);

        if (buffer.value.length > 100) buffer.value.shift();
        buffer.value = [chatStore.message, ...buffer.value];
        currentBufferIndex.value = -1;
        chatStore.message = '';
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (chatStore.message && chatStore.message.startsWith(chatStore.prefix)) return;
    if (buffer.value.length === 0) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentBufferIndex.value > 0) {
            chatStore.message = buffer.value[--currentBufferIndex.value];
        } else if (currentBufferIndex.value === 0) {
            currentBufferIndex.value = -1;
            chatStore.message = previousMessage.value;
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentBufferIndex.value < 0) previousMessage.value = chatStore.message;
        if (currentBufferIndex.value < buffer.value.length - 1) {
            chatStore.message = buffer.value[++currentBufferIndex.value];
        }
    }
}

watch(chatStore, async (_, newValue) => {
    const { focus } = newValue;
    if (focus) {
        await nextTick();
        inputRef!.value!.focus();
    } else currentBufferIndex.value = -1;
});

onMounted(() => window.addEventListener('keydown', handleKeydown));

onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
    <input
        class="bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] focus:outline-none w-full"
        :class="{ invisible: !chatStore.focus, visible: chatStore.focus }"
        :placeholder="chatStore.placeholder"
        v-model="chatStore.message"
        ref="inputRef"
        @keydown="sendMessage"
        @blur="() => inputRef?.focus()"
    />
</template>
