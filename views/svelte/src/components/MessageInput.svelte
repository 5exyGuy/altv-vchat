<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import PaperIcon from '../icons/PaperIcon.svelte';

    export let placeholder: string = 'Type a message...';
    // export let commands = {};

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
            case 'Escape':
                value = '';
                event.preventDefault();
                break;
        }
    }
</script>

<div class="message-input">
    <input {placeholder} bind:value on:input={processInput} on:keydown={processKeyDown} />
    <button on:click={() => dispatch('send', { message: value })}>
        <PaperIcon />
    </button>
</div>

<style lang="scss">
    @import 'MessageInput.scss';
</style>
