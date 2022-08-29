<script setup lang="ts">
import Messages from './components/Messages.vue';
import MessageInput from './components/MessageInput.vue';
import CommandSuggestions from './components/CommandSuggestions.vue';
import { onMounted, onUnmounted } from 'vue';
import { useChatStore } from './stores';

// --------------------------------------------------------------
// Chat Store
// --------------------------------------------------------------

const { setFocus } = useChatStore();

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

// --------------------------------------------------------------
// Hooks
// --------------------------------------------------------------

// Mount --------------------------------------------------------

onMounted(() => {
    window?.alt?.on('vchat:focus', toggleFocus);
    // window?.alt?.on('vchat:loadSettings', loadSettings);
    window?.alt?.emit('vchat:mounted');
});

// Unmount ------------------------------------------------------

onUnmounted(() => {
    window?.alt?.off('vchat:focus', toggleFocus);
    // window?.alt?.off('vchat:loadSettings', loadSettings);
});
</script>

<template>
    <div class="fixed top-[16px] left-[16px] w-[640px]">
        <Messages />
        <MessageInput />
        <CommandSuggestions />
    </div>
</template>
