<script lang="ts">
    import { onMount } from 'svelte';
    import Commands from './components/Commands.svelte';
    import MessageInput from './components/MessageInput.svelte';
    import Messages from './components/Messages.svelte';

    let message: string = '';
    const prefix: string = '/';
    const maxCmds: number = 3;

    onMount(() => window?.alt?.emit('vchat:mounted'));
</script>

<div class="fixed top-[16px] left-[16px] w-[640px]">
    <Messages />
    <MessageInput bind:message {prefix} />
    <Commands bind:message max={maxCmds} {prefix} />
</div>
