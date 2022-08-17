<script lang="ts">
    import Message from './Message.svelte';

    export let messages: Array<string> = [];
</script>

<div class="test flex flex-col gap-2 mb-4 h-80 overflow-y-scroll">
    {#each messages as message}
        <Message>{@html message}</Message>
    {/each}
</div>

<style lang="scss">
    .test {
        // --scrollbar-width: 8px;
        // --mask-height: 4rem;
        // overflow-y: auto;
        // padding-bottom: var(--mask-height);
        // --mask-image-content: linear-gradient(
        //     to bottom,
        //     transparent,
        //     black var(--mask-height),
        //     black calc(100% - var(--mask-height) + 2rem),
        //     transparent
        // );
        // --mask-size-content: calc(100% - var(--scrollbar-width)) 100%;
        // --mask-image-scrollbar: linear-gradient(black, black);
        // --mask-size-scrollbar: var(--scrollbar-width) 100%;
        // mask-image: var(--mask-image-content), var(--mask-image-scrollbar);
        // mask-size: var(--mask-size-content), var(--mask-size-scrollbar);
        // mask-position: 0 0, 100% 0;
        // mask-repeat: no-repeat, no-repeat;
    }

    ::-webkit-scrollbar {
        background: transparent;
        width: 0;
    }
</style>
