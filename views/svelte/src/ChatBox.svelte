<script lang="ts">
    import { onMount } from 'svelte';
    import Channel from './components/Channel.svelte';
    import Message from './components/Message.svelte';
    import MessageInput from './components/MessageInput.svelte';
    import ChevronDownIcon from './icons/ChevronDownIcon.svelte';

    let channels = ['Global', 'Channel #1', 'Channel #2'];
    let messages = [
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        'Contrary to popular belief, Lorem Ipsum is not simply random text.',
        'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        'Contrary to popular belief, Lorem Ipsum is not simply random text.',
        'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
    ];

    let messagesRef: HTMLDivElement;
    let currentChannel: number = -1;

    function processMessageSend() {}

    onMount(() => {
        messagesRef.scrollTop = messagesRef.scrollHeight - messagesRef.clientHeight;

        if (window.alt) {
            window.alt.emit('vchat:mounted');
        }
    });
</script>

<div class="chat-box">
    <div class="chat-box-channels">
        {#each channels as channel}
            <Channel>{channel}</Channel>
        {/each}
    </div>
    <div class="chat-box-messages" bind:this={messagesRef}>
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
