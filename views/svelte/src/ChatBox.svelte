<script lang="ts">
    import { onMount } from 'svelte';
    import Commands from './components/Commands.svelte';
    import MessageInput from './components/MessageInput.svelte';
    import Messages from './components/Messages.svelte';

    let message: string = '';
    const prefix: string = '/';

    onMount(() => {
        if (!window.alt) return;
        window.alt.emit('vchat:mounted');
    });
</script>

<div class="flex flex-col m-[16px] top-[240px] w-[640px]">
    <Messages />
    <MessageInput bind:message />
    <Commands bind:message max={3} {prefix} />
</div>
