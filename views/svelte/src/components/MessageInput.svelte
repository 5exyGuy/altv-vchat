<script lang="ts">
    import { onDestroy, onMount, tick } from 'svelte';

    // --------------------------------------------------------------
    // Props
    // --------------------------------------------------------------

    export let placeholder: string = 'Type a message...';
    export let message: string = '';
    export let prefix: string = '/';

    // --------------------------------------------------------------
    // Variables
    // --------------------------------------------------------------

    let buffer: Array<string> = [];
    let currentBufferIndex: number = -1;
    let ref: HTMLInputElement;
    let focus: boolean = false;
    let previousMessage: string = '';

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    async function sendMessage(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            window?.alt?.emit('vchat:message', message);

            if (buffer.length > 100) buffer.shift();
            buffer = [message, ...buffer];
            currentBufferIndex = -1;
            message = '';
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (message && message.startsWith(prefix)) return;
        if (buffer.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (currentBufferIndex > 0) {
                message = buffer[--currentBufferIndex];
            } else if (currentBufferIndex === 0) {
                currentBufferIndex = -1;
                message = previousMessage;
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (currentBufferIndex < 0) previousMessage = message;
            if (currentBufferIndex < buffer.length - 1) {
                message = buffer[++currentBufferIndex];
            }
        }
    }

    async function toggleFocus(_focus: boolean) {
        focus = _focus;
        if (_focus) {
            await tick();
            ref?.focus();
        } else currentBufferIndex = -1;
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
    });

    onDestroy(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
    });
</script>

<input
    class="bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] focus:outline-none w-full"
    class:invisible={!focus}
    class:visible={focus}
    {placeholder}
    bind:value={message}
    bind:this={ref}
    on:keydown={sendMessage}
    on:blur={() => ref.focus()}
/>

<svelte:window on:keydown={handleKeydown} />
