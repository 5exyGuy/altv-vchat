<script lang="ts">
    import CrossIcon from '../icons/CrossIcon.svelte';

    export let selected: boolean = false;
    export let closable: boolean = true;
</script>

<div class="channel" class:channel-selected={selected}>
    <slot />
    {#if closable}
        <button>
            <CrossIcon />
        </button>
    {/if}
</div>

<style lang="scss">
    .channel {
        display: inline-block;
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
        background: rgb(50, 50, 50);
        color: #eee;
        text-transform: uppercase;
        border-radius: 0.5rem;
        margin-bottom: 5px;

        &-selected {
            background: rgb(0, 135, 54);
        }

        &:hover {
            background: rgb(0, 135, 54);
        }
    }
</style>
