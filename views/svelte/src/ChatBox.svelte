<script lang="ts">
    import { onMount, tick } from 'svelte';
    import MessageInput from './components/MessageInput.svelte';
    import Messages from './components/Messages.svelte';

    let messages = [];

    async function processMessageSend(event: CustomEvent<{ message: string }>) {
        const { message } = event.detail;
        if (!message || typeof message !== 'string' || message.length === 0) return;

        messages = [...messages, message];
    }

    onMount(() => {
        if (window.alt) {
            window.alt.emit('vchat:mounted');
        }
    });
</script>

<div class="flex flex-col m-4 top-60 w-[40rem]">
    <Messages {messages} />
    <MessageInput on:send={processMessageSend} />
</div>
