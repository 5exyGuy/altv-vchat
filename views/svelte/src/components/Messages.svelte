<script lang="ts">
    import { onMount, tick } from 'svelte';
    import Message from './Message.svelte';

    // Props

    export let scrollStep: number = 20;

    // Variables

    let messages: Array<string> = [];
    let ref: HTMLDivElement;
    let focus: boolean = false;
    let boxHeight: number = 0;
    let currentScroll: number = 0;

    // Functions

    async function addMessage(message: string) {
        messages = [...messages, message]; // Add message to array
        await tick(); // Wait for next tick
        if (ref) boxHeight = ref.scrollHeight - ref.clientHeight; // Get height of box
        // If the box is focused and previous scroll was at the bottom, scroll to the bottom again
        if (!focus || (focus && currentScroll === boxHeight)) scrollToBottom();
    }

    async function setMessages(_messages: Array<string>) {
        messages = _messages;
        await tick();
        if (ref) boxHeight = ref.scrollHeight - ref.clientHeight;
        if (!focus || (focus && currentScroll === boxHeight)) scrollToBottom('auto');
    }

    function scrollToTop(behavior: ScrollBehavior = 'smooth') {
        currentScroll = 0;
        if (ref) ref.scrollTo({ top: 0, behavior });
    }

    function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        currentScroll = boxHeight;
        if (ref) ref.scroll({ top: boxHeight, behavior });
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

    function handleKeydown(event: KeyboardEvent) {
        if (!focus) return;
        if (event.key === 'PageUp') {
            event.preventDefault();
            scrollUp();
        } else if (event.key === 'PageDown') {
            event.preventDefault();
            scrollDown();
        } else if (event.key === 'Home') {
            event.preventDefault();
            scrollToTop();
        } else if (event.key === 'End') {
            event.preventDefault();
            scrollToBottom();
        }
    }

    async function processScroll(event: WheelEvent) {
        if (!focus) return;
        if (event.deltaY > 0) scrollDown();
        else scrollUp();
    }

    //

    $: maskTopHeight = currentScroll === 0 ? '0px' : `${Math.floor((64 * currentScroll) / boxHeight)}px`;
    $: maskBottomHeight =
        currentScroll === boxHeight ? '0px' : `${Math.floor((64 * (boxHeight - currentScroll)) / boxHeight)}px`;

    // Hooks

    onMount(() => {
        boxHeight = ref.scrollHeight - ref.clientHeight;
        scrollToBottom('auto');

        if (!window.alt) return;
        window.alt.on('vchat:loadHistory', async (messages) => await setMessages(messages));
        window.alt.on('vchat:message', async (message) => await addMessage(message));
        window.alt.on('vchat:focus', (_focus) => {
            focus = _focus;
            if (!_focus) scrollToBottom();
        });
    });
</script>

<div
    class="flex flex-col gap-[8px] h-[320px] w-full mask pl-[8px] mb-[16px]"
    class:opacity-50={!focus}
    class:opacity-100={focus}
    class:overflow-y-scroll={focus && ref?.scrollHeight > ref?.clientHeight}
    class:overflow-y-hidden={!focus}
    style:--mask-top-height={maskTopHeight}
    style:--mask-bottom-height={maskBottomHeight}
    bind:this={ref}
>
    {#each messages as message}
        <Message>{@html message}</Message>
    {/each}
</div>

<svelte:window on:keydown={handleKeydown} on:mousewheel|nonpassive|preventDefault={processScroll} />

<style lang="scss">
    @import 'Messages.scss';
</style>
