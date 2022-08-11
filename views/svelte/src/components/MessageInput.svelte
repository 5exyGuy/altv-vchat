<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let placeholder: string = 'Type a message...';

    const dispatch = createEventDispatcher();
    let value: string;

    function processInput(event: HTMLElementEventMap['input']) {}

    function processKeyDown(event: HTMLElementEventMap['keydown']) {
        switch (event.key) {
            case 'Enter':
                dispatch('send', { message: value });
                value = '';
                event.preventDefault();
                break;
        }
    }
</script>

<input
    class="bg-black bg-opacity-50 text-base text-white px-4 py-2 focus:outline-none"
    {placeholder}
    bind:value
    on:input={processInput}
    on:keydown={processKeyDown}
/>
