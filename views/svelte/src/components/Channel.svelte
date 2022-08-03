<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import CrossIcon from '../icons/CrossIcon.svelte';

    export let name: string = 'Global';
    export let selected: boolean = false;
    export let closable: boolean = true;

    const dispatch = createEventDispatcher();
</script>

<div class="channel" class:channel-selected={selected}>
    <button class="channel-name">{name}</button>
    {#if closable}
        <button class="channel-close" on:click={() => dispatch('close')}>
            <CrossIcon />
        </button>
    {/if}
</div>

<style lang="scss">
    @import 'Channel.scss';
</style>
