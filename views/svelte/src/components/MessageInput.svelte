<script lang="ts">
    import { onMount, tick } from 'svelte';
    export let placeholder: string = 'Type a message...';
    export let message: string = '';

    let buffer: Array<string> = [];
    let ref: HTMLInputElement;
    let focus: boolean = false;

    async function sendMessage(event: KeyboardEvent) {
        if (event.key !== 'Enter') return;

        if (window.alt) window.alt.emit('vchat:message', message);
        message = '';
        buffer = [...buffer, message];

        event.preventDefault();
    }

    onMount(() => {
        if (!window.alt) return;
        window.alt.on('vchat:focus', async (_focus) => {
            focus = _focus;
            if (_focus) {
                await tick();
                ref.focus();
            }
        });
    });
</script>

<input
    class="bg-black bg-opacity-50 text-base text-white px-4 py-2 focus:outline-none invisible"
    class:!visible={focus}
    {placeholder}
    bind:value={message}
    bind:this={ref}
    on:keydown={sendMessage}
/>

<svelte:body on:click|stopPropagation|preventDefault on:contextmenu|stopPropagation|preventDefault />
