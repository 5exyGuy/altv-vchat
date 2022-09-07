<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { MessageType } from '../enums';
import type { Message as MessageData } from '../interfaces';
import { useChatStore } from '../stores';
import Message from './Message.vue';

// --------------------------------------------------------------
// Chat Store
// --------------------------------------------------------------

const { focus, options } = useChatStore();

// --------------------------------------------------------------
// Local Variables
// --------------------------------------------------------------

const messages = ref([] as Array<MessageData>);
const currentScroll = ref(0);
const boxHeight = ref(0);
const clientHeight = ref(0);
const scrollHeight = ref(0);

// --------------------------------------------------------------
// Computed Local Values
// --------------------------------------------------------------

const maskTopHeight = computed(() =>
    currentScroll.value === 0 ? '0px' : `${Math.floor((64 * currentScroll.value) / boxHeight.value)}px`,
);
const maskBottomHeight = computed(() =>
    currentScroll === boxHeight
        ? '0px'
        : `${Math.floor((64 * (boxHeight.value - currentScroll.value)) / boxHeight.value)}px`,
);

// --------------------------------------------------------------
// Refs
// --------------------------------------------------------------

const messagesRef = ref<HTMLDivElement>();

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

// Messages -----------------------------------------------------

/**
 * Adds a message to the chat box sent by the server.
 * @param message The message to add.
 * @param type The type of message.
 */
async function addMessage(message: string, type: MessageType = MessageType.Default) {
    messages.value = [...messages.value, { content: message, type }];
    await nextTick();
    scrollHeight.value = messagesRef.value!.scrollHeight;
    clientHeight.value = messagesRef.value!.clientHeight;
    boxHeight.value = scrollHeight.value - clientHeight.value;
    if (focus.value || (!focus.value && currentScroll.value === boxHeight.value)) return;
    scrollToBottom();
}

/**
 * Loads the messages from the client's local storage.
 * @param _messages The messages to load.
 */
async function loadMessages(_messages: Array<MessageData>) {
    messages.value = _messages;
    await nextTick();
    scrollHeight.value = messagesRef.value!.scrollHeight;
    clientHeight.value = messagesRef.value!.clientHeight;
    boxHeight.value = scrollHeight.value - clientHeight.value;
    if (focus.value || (!focus.value && currentScroll.value === boxHeight.value)) return;
    scrollToBottom();
}

/**
 * Clears the messages from the chat box sent by the server.
 */
function clearMessages() {
    loadMessages([]);
}

// Scrolling ----------------------------------------------------

/**
 * Scrolls the chat box to the top.
 * @param behavior Whether or not to scroll smoothly.
 */
function scrollToTop(behavior: ScrollBehavior = 'smooth') {
    messagesRef.value!.scrollTo({ top: 0, behavior });
    currentScroll.value = 0;
}

/**
 * Scrolls the chat box to the bottom.
 * @param behavior Whether or not to scroll smoothly.
 */
function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    messagesRef.value!.scroll({ top: boxHeight.value, behavior });
    currentScroll.value = boxHeight.value;
}

/**
 * Scrolls the chat box up by the specified amount in the chat store.
 */
function scrollUp() {
    const scrollTo = currentScroll.value - options.scrollStep < 0 ? 0 : currentScroll.value - options.scrollStep;
    messagesRef.value!.scrollTop = scrollTo;
    currentScroll.value = scrollTo;
}

/**
 * Scrolls the chat box down by the specified amount in the chat store.
 */
function scrollDown() {
    const scrollTo =
        currentScroll.value + options.scrollStep > boxHeight.value
            ? boxHeight.value
            : currentScroll.value + options.scrollStep;
    messagesRef.value!.scrollTop = scrollTo;
    currentScroll.value = scrollTo;
}

/**
 * Scrolls the chat box to the specified position.
 * @param event The keyboard event.
 */
function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'PageUp' && event.key !== 'PageDown' && event.key !== 'Home' && event.key !== 'End') return;

    if (event.key === 'PageUp') scrollUp();
    else if (event.key === 'PageDown') scrollDown();
    else if (event.key === 'Home') scrollToTop();
    else if (event.key === 'End') scrollToBottom();

    event.preventDefault();
}

/**
 * Scrolls the chat box to the specified position.
 * @param event The mouse wheel event.
 */
async function processScroll(event: WheelEvent) {
    event.preventDefault();
    if (!focus.value) return;
    event.deltaY < 0 ? scrollUp() : scrollDown();
}

// --------------------------------------------------------------
// Hooks
// --------------------------------------------------------------

// Effects ------------------------------------------------------

// Mount --------------------------------------------------------

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('wheel', processScroll, { passive: false });

    window?.alt?.on('vchat:loadMessageHistory', loadMessages);
    window?.alt?.on('vchat:addMessage', addMessage);
    window?.alt?.on('vchat:clearMessages', clearMessages);
});

// Unmount ------------------------------------------------------

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('wheel', processScroll);

    window?.alt?.off('vchat:loadMessageHistory', loadMessages);
    window?.alt?.off('vchat:addMessage', addMessage);
    window?.alt?.off('vchat:clearMessages', clearMessages);
});
</script>

<template>
    <div
        class="scrollbar mask flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2"
        :class="{
            'opacity-50': !focus,
            'opacity-100': focus,
        }"
        :style="{
            '--scrollbar-opacity': focus && scrollHeight > clientHeight ? 1 : 0,
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
