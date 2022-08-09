<script lang="ts">
    import Message from './Message.svelte';

    export let messages: Array<string> = [];

    let messagesRef: HTMLDivElement;
</script>

{#if messages.length > 0}
    <div class="flex flex-col gap-2 max-h-40 overflow-y-scroll" bind:this={messagesRef}>
        {#each messages as message}
            <Message>{message}</Message>
        {/each}
    </div>
{/if}

<style lang="scss">
    ::-webkit-scrollbar {
        background: transparent;
        width: 0;
    }
</style>
