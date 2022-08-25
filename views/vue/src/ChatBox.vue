<script setup lang="ts">
import Messages from './components/Messages.vue';
import MessageInput from './components/MessageInput.vue';
import Commands from './components/Commands.vue';
import { onMounted, onUnmounted } from 'vue';
import { chatStore } from './stores';

function toggleFocus(focus: boolean) {
    chatStore.focus = focus;
}

onMounted(() => {
    window?.alt?.on('vchat:focus', toggleFocus);
    window?.alt?.emit('vchat:mounted');
});

onUnmounted(() => window?.alt?.off('vchat:focus', toggleFocus));
</script>

<template>
    <div class="fixed top-[16px] left-[16px] w-[640px]">
        <Messages />
        <MessageInput />
        <Commands />
    </div>
</template>
