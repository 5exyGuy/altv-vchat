<script lang="ts">
    import { onMount, tick } from 'svelte';
    import Channel from './components/Channel.svelte';
    import Message from './components/Message.svelte';
    import MessageInput from './components/MessageInput.svelte';

    let channels = [
        { name: 'global', closable: false },
        { name: 'local', closable: true },
    ];
    let messages = [];

    let messagesRef: HTMLDivElement;
    let currentChannel: number = -1;

    async function processMessageSend(event: CustomEvent<{ message: string }>) {
        const { message } = event.detail;
        if (!message || typeof message !== 'string' || message.length === 0) return;

        messages = [...messages, message];

        await tick();
        messagesRef.scrollTo({ behavior: 'smooth', top: messagesRef.scrollHeight });
    }

    function processMessageScroll(event: Event) {}

    onMount(() => {
        messagesRef.scrollTo({ behavior: 'smooth', top: messagesRef.scrollHeight });

        if (window.alt) {
            window.alt.emit('vchat:mounted');
        }
    });
</script>

<div class="chat-box">
    <div class="chat-box-channels">
        {#each channels as channel}
            <Channel name={channel.name} closable={channel.closable} />
        {/each}
    </div>
    <div class="chat-box-messages" bind:this={messagesRef} on:scroll={processMessageScroll}>
        {#if messages.length === 0}
            <p class="chat-box-messages-empty">No messages yet.</p>
        {/if}

        {#each messages as message}
            <Message>{message}</Message>
        {/each}
        <!-- <button class="absolute right-0">
            <ChevronDownIcon />
        </button> -->
    </div>
    <MessageInput on:send={processMessageSend} />
</div>

<style lang="scss">
    @import 'ChatBox.scss';
</style>
