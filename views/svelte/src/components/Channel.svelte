<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import CrossIcon from '../icons/CrossIcon.svelte';
    import Button from './Button.svelte';

    export let name: string;
    // export let selected: boolean = false;
    export let closable: boolean = true;

    const dispatch = createEventDispatcher();
</script>

<div class="channel">
    <div class="channel-new-message" />
    <Button on:click={() => dispatch('click', { name })}>
        {name}
    </Button>
    {#if closable}
        <button class="btn-channel-close" on:click={() => dispatch('close', { name })}>
            <CrossIcon />
        </button>
    {/if}
</div>

<style lang="scss">
    @import 'Channel.scss';
</style>
