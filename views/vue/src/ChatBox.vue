<script setup lang="ts">
import Messages from './components/Messages.vue';
import MessageInput from './components/MessageInput.vue';
import CommandSuggestions from './components/CommandSuggestions.vue';
import { onMounted, onUnmounted } from 'vue';
import { useChatStore } from './stores';
import type { Options } from './interfaces';

// --------------------------------------------------------------
// Chat Store
// --------------------------------------------------------------

const { setFocus, setOptions } = useChatStore();

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

// Focus --------------------------------------------------------

/**
 * Toggle focus on the chat box.
 * @param focus Whether the chat box is focused.
 */
function toggleFocus(focus: boolean) {
    setFocus(focus);
}

/**
 * Syncs the client settings with the server settings.
 * @param settings The chat window's settings.
 */
function syncSettings(settings: Options) {
    setOptions(settings);
    window?.alt?.emit('vchat:mounted');
}

/**
 * Updates the window's options.
 * @param options The new options.
 */
function updateOptions(options: Options) {
    setOptions(options);
}

// --------------------------------------------------------------
// Hooks
// --------------------------------------------------------------

// Mount --------------------------------------------------------

onMounted(() => {
    window?.alt?.on('vchat:focus', toggleFocus);
    window?.alt?.on('vchat:syncSettings', syncSettings);
    window?.alt?.on('vchat:updateOptions', updateOptions);
    window?.alt?.emit('vchat:requestSettings');
});

// Unmount ------------------------------------------------------

onUnmounted(() => {
    window?.alt?.off('vchat:focus', toggleFocus);
    window?.alt?.off('vchat:syncSettings', syncSettings);
    window?.alt?.off('vchat:updateOptions', updateOptions);
});
</script>

<template>
    <div class="fixed top-[16px] left-[16px] w-[640px]">
        <Messages />
        <MessageInput />
        <CommandSuggestions />
    </div>
</template>
