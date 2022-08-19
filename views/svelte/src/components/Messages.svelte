<script lang="ts">
    import { onMount, tick } from 'svelte';
    import Message from './Message.svelte';

    // Props

    export let scrollStep: number = 20;

    // Variables

    let messages: Array<string> = [
        'My life is a crazy explosion of shapes and colors - Creativity',
        'I tend to be the peacemaker between friends',
        'Every day - if walking through the shops count as working out!',
        'Yes, but I only have a couple of items on it',
        'Good question - I am still trying to figure that out!',
        'My life is a crazy explosion of shapes and colors - Creativity',
        'I tend to be the peacemaker between friends',
        'Every day - if walking through the shops count as working out!',
        'Yes, but I only have a couple of items on it',
        'Good question - I am still trying to figure that out!',
        'My life is a crazy explosion of shapes and colors - Creativity',
        'I tend to be the peacemaker between friends',
        'Every day - if walking through the shops count as working out!',
        'Yes, but I only have a couple of items on it',
        'Good question - I am still trying to figure that out!',
        'My life is a crazy explosion of shapes and colors - Creativity',
        'I tend to be the peacemaker between friends',
        'Every day - if walking through the shops count as working out!',
        'Yes, but I only have a couple of items on it',
        'Good question - I am still trying to figure that out!',
    ];
    let ref: HTMLDivElement;
    let focus: boolean = false;
    let boxHeight: number = 0;
    let currentScroll: number = 0;

    // Functions

    async function addMessage(message: string) {
        messages = [...messages, message]; // Add message to array
        await tick(); // Wait for next tick
        boxHeight = ref.scrollHeight - ref.clientHeight; // Get height of box
        // If the box is focused and previous scroll was at the bottom, scroll to the bottom again
        if (!focus || (focus && currentScroll === boxHeight)) scrollToBottom();
    }

    function scrollToBottom() {
        currentScroll = boxHeight;
        ref.scroll({
            top: boxHeight,
            behavior: 'smooth',
        });
    }

    function scrollUp() {
        const scroll = currentScroll - scrollStep;
        currentScroll = scroll < 0 ? 0 : scroll;
        ref.scrollTop = scroll;
    }

    function scrollDown() {
        const scroll = currentScroll + scrollStep;
        currentScroll = scroll > boxHeight ? boxHeight : scroll;
        ref.scrollTop = scroll;
    }

    function scroll(event: KeyboardEvent) {
        if (event.key === 'PageUp') {
            event.preventDefault();
            scrollUp();
        } else if (event.key === 'PageDown') {
            event.preventDefault();
            scrollDown();
        }
    }

    async function processScroll(event: WheelEvent) {
        if (event.deltaY > 0) scrollDown();
        else scrollUp();
    }

    //

    $: maskTopHeight = currentScroll === 0 ? '0px' : `${(64 * currentScroll) / boxHeight}px`;
    $: maskBottomHeight = currentScroll === boxHeight ? '0px' : `${(64 * (boxHeight - currentScroll)) / boxHeight}px`;

    // Hooks

    onMount(() => {
        boxHeight = ref.scrollHeight - ref.clientHeight;
        scrollToBottom();

        if (!window.alt) return;
        window.alt.on('vchat:message', async (message) => await addMessage(message));
        window.alt.on('vchat:focus', (_focus) => {
            focus = _focus;
            if (!_focus) {
                scrollToBottom();
            }
        });
    });
</script>

<div
    class="flex flex-col gap-[8px] h-[320px] overflow-y-scroll mb-[16px] opacity-50 mask"
    class:opacity-100={focus}
    class:!overflow-y-hidden={!focus}
    style:direction="rtl"
    style:--mask-top-height={maskTopHeight}
    style:--mask-bottom-height={maskBottomHeight}
    bind:this={ref}
>
    <div class="ml-4" style:direction="ltr">
        {#each messages as message}
            <Message>{@html message}</Message>
        {/each}
    </div>
</div>

<svelte:window on:keydown={scroll} on:mousewheel|nonpassive|preventDefault={processScroll} />

<style lang="scss">
    @import 'Messages.scss';
</style>
