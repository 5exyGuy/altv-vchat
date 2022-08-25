<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { MessageType } from '../enums';
import type { Message as MessageData } from '../interfaces';
import { chatStore } from '../stores';
import Message from './Message.vue';

const scrollStep = 20;

const messages = ref([] as Array<MessageData>);
const boxHeight = ref(0);
const currentScroll = ref(0);
const messagesRef = ref<HTMLDivElement>();
const maskTopHeight = computed(() =>
    currentScroll.value === 0 ? '0px' : `${Math.floor((64 * currentScroll.value) / boxHeight.value)}px`,
);
const maskBottomHeight = computed(() =>
    currentScroll === boxHeight
        ? '0px'
        : `${Math.floor((64 * (boxHeight.value - currentScroll.value)) / boxHeight.value)}px`,
);

async function addMessage(message: string, type: MessageType = MessageType.Default) {
    messages.value = [...messages.value, { content: message, type }]; // Add message to array
    await nextTick(); // Wait for next tick
    boxHeight.value = messagesRef!.value!.scrollHeight - messagesRef!.value!.clientHeight; // Get height of box
    // If the box is focused and previous scroll was at the bottom, scroll to the bottom again
    if (!chatStore.focus || (chatStore.focus && currentScroll === boxHeight)) scrollToBottom();
}

async function setMessages(_messages: Array<MessageData>) {
    messages.value = _messages;
    await nextTick();
    boxHeight.value = messagesRef!.value!.scrollHeight - messagesRef!.value!.clientHeight;
    if (!chatStore.focus || (chatStore.focus && currentScroll.value === boxHeight.value)) scrollToBottom('auto');
}

function clearMessages() {
    setMessages([]);
}

function toggleFocus(focus: boolean) {
    chatStore.focus = focus;
    if (!focus) scrollToBottom();
}

function scrollToTop(behavior: ScrollBehavior = 'smooth') {
    currentScroll.value = 0;
    messagesRef?.value?.scrollTo({ top: 0, behavior });
}

function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    currentScroll.value = boxHeight.value;
    messagesRef?.value?.scroll({ top: boxHeight.value, behavior });
}

function scrollUp() {
    const scroll = currentScroll.value - scrollStep;
    currentScroll.value = scroll < 0 ? 0 : scroll;
    messagesRef!.value!.scrollTop = scroll;
}

function scrollDown() {
    const scroll = currentScroll.value + scrollStep;
    currentScroll.value = scroll > boxHeight.value ? boxHeight.value : scroll;
    messagesRef!.value!.scrollTop = scroll;
}

function handleKeydown(event: KeyboardEvent) {
    if (!chatStore.focus) return;
    if (event.key === 'PageUp') {
        event.preventDefault();
        scrollUp();
    } else if (event.key === 'PageDown') {
        event.preventDefault();
        scrollDown();
    } else if (event.key === 'Home') {
        event.preventDefault();
        scrollToTop();
    } else if (event.key === 'End') {
        event.preventDefault();
        scrollToBottom();
    }
}

async function processScroll(event: WheelEvent) {
    if (!chatStore.focus) return;
    event.deltaY > 0 ? scrollDown() : scrollUp();
}

onMounted(() => {
    boxHeight.value = messagesRef!.value!.scrollHeight - messagesRef!.value!.clientHeight;
    scrollToBottom('auto');

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('wheel', processScroll, { passive: false });

    window?.alt?.on('vchat:loadHistory', setMessages);
    window?.alt?.on('vchat:message', addMessage);
    window?.alt?.on('vchat:focus', toggleFocus);
    window?.alt?.on('vchat:clear', clearMessages);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('wheel', processScroll);

    window?.alt?.off('vchat:loadHistory', setMessages);
    window?.alt?.off('vchat:message', addMessage);
    window?.alt?.off('vchat:focus', toggleFocus);
    window?.alt?.off('vchat:clear', clearMessages);
});
</script>

<template>
    <div
        class="flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2"
        :class="{
            'opacity-50': !chatStore.focus,
            'opacity-100': chatStore.focus,
            'overflow-y-scroll': chatStore.focus && messagesRef!.scrollHeight > messagesRef!.clientHeight,
            'overflow-y-hidden': !chatStore.focus
        }"
        :style="{
            '--mask-top-height': maskTopHeight,
            '--mask-bottom-height': maskBottomHeight,
        }"
        ref="messagesRef"
    >
        <Message v-for="message in messages" :content="message.content" :type="message.type" />
    </div>
</template>

<style lang="scss">
@import './Messages.scss';
</style>
