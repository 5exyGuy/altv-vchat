<script lang="ts">
    import { onMount } from 'svelte';
    import Commands from './components/Commands.svelte';
    import MessageInput from './components/MessageInput.svelte';
    import Messages from './components/Messages.svelte';

    let messages: Array<string> = [];
    let message: string = '';

    onMount(() => {
        if (window.alt) {
            window.alt.emit('vchat:mounted');
        }
    });
</script>

<div class="flex flex-col m-4 top-60 w-[40rem]">
    <Messages {messages} />
    <MessageInput bind:message bind:messages />
    <Commands bind:message />
</div>
