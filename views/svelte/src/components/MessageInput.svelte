<script lang="ts">
    import { onMount, tick } from 'svelte';

    export let placeholder: string = 'Type a message...';
    export let message: string = '';
    export let prefix: string = '/';

    let buffer: Array<string> = [];
    let currentBufferIndex: number = 0;
    let ref: HTMLInputElement;
    let focus: boolean = false;

    async function sendMessage(event: KeyboardEvent) {
        if (event.key !== 'Enter') return;

        if (window.alt) window.alt.emit('vchat:message', message);
        buffer = [...buffer, message];
        message = '';

        event.preventDefault();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (message.startsWith(prefix)) return;

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (buffer.length > 0) {
                currentBufferIndex = currentBufferIndex - 1 < 0 ? 0 : currentBufferIndex - 1;
                message = buffer[currentBufferIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (buffer.length > 0) {
                currentBufferIndex =
                    currentBufferIndex + 1 > buffer.length - 1 ? buffer.length - 1 : currentBufferIndex + 1;
                message = buffer[currentBufferIndex];
            }
        }
    }

    onMount(() => {
        if (!window.alt) return;
        window.alt.on('vchat:focus', async (_focus) => {
            focus = _focus;
            if (_focus) {
                await tick();
                if (ref) ref.focus();
            }
        });
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

<!-- <svelte:body
    on:click|preventDefault={() => {
        if (ref) ref.focus();
    }}
    on:contextmenu|preventDefault={() => {
        if (ref) ref.focus();
    }} /> -->
<svelte:window on:keydown={handleKeydown} />
