<script lang="ts">
    import { onMount, tick } from 'svelte';
    import Channel from './components/Channel.svelte';
    import Message from './components/Message.svelte';
    import MessageInput from './components/MessageInput.svelte';

    const channels = new Map<string, { closable: boolean }>([
        ['global', { closable: false }],
        ['local', { closable: true }],
    ]);
    const channelMessages = new Map<string, Array<string>>([
        ['global', []],
        ['local', ['Hello', 'World']],
    ]);

    let messagesRef: HTMLDivElement;
    let currentChannel = 'global';
    let messages = channelMessages.get(currentChannel);

    async function processMessageSend(event: CustomEvent<{ message: string }>) {
        const { message } = event.detail;
        if (!message || typeof message !== 'string' || message.length === 0) return;

        const channel = channelMessages.get(currentChannel);
        if (!channel) return;

        messages = [...channel, message];
        channelMessages.set(currentChannel, messages);

        await tick();
        messagesRef?.scrollTo({ behavior: 'smooth', top: messagesRef.scrollHeight });
    }

    function processMessageScroll(event: Event) {}

    function processChannelClick(event: CustomEvent<{ name: string }>) {
        currentChannel = event.detail.name;
        messages = channelMessages.get(currentChannel);
    }

    onMount(() => {
        messagesRef?.scrollTo({ behavior: 'smooth', top: messagesRef.scrollHeight });

        if (window.alt) {
            window.alt.emit('vchat:mounted');
        }
    });
</script>

<div class="chat-box">
    <div class="header">
        <div class="channels">
            {#each [...channels] as channel}
                <Channel name={channel[0]} closable={channel[1].closable} on:click={processChannelClick} />
            {/each}
        </div>
        <div class="controls">
            <div class="">Minimize</div>
        </div>
    </div>
    {#if messages.length > 0}
        <div class="messages" bind:this={messagesRef} on:scroll={processMessageScroll}>
            {#each messages as message}
                <Message>{message}</Message>
            {/each}
            <!-- <button class="absolute right-0">
            <ChevronDownIcon />
        </button> -->
        </div>
    {/if}
    <MessageInput on:send={processMessageSend} />
</div>

<style lang="scss">
    @import 'ChatBox.scss';
</style>
