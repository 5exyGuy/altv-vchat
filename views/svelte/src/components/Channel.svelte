<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import CrossIcon from '../icons/CrossIcon.svelte';

    export let name: string;
    export let selected: boolean = false;
    export let closable: boolean = true;

    const dispatch = createEventDispatcher();
</script>

<div class="channel">
    <div class="channel-new-message" />
    <button class="btn-channel-name" class:channel-selected={selected} on:click={() => dispatch('click', { name })}>
        {name}
    </button>
    {#if closable}
        <button class="btn-channel-close" on:click={() => dispatch('close', { name })}>
            <CrossIcon />
        </button>
    {/if}
</div>

<style lang="scss">
    @import 'Channel.scss';
</style>
