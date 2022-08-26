<script lang="ts">
    import type { Message as MessageData } from '../interfaces';
    import { onDestroy, onMount, tick } from 'svelte';
    import Message from './Message.svelte';
    import { MessageType } from '../enums';

    // --------------------------------------------------------------
    // Props
    // --------------------------------------------------------------

    export let scrollStep: number = 20;

    // --------------------------------------------------------------
    // Variables
    // --------------------------------------------------------------

    let messages: Array<MessageData> = [];
    let ref: HTMLDivElement | undefined;
    let focus: boolean = false;
    let boxHeight: number = 0;
    let currentScroll: number = 0;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    async function addMessage(message: string, type: MessageType = MessageType.Default) {
        messages = [...messages, { content: message, type }]; // Add message to array
        await tick(); // Wait for next tick
        if (ref) boxHeight = ref.scrollHeight - ref.clientHeight; // Get height of box
        // If the box is focused and previous scroll was at the bottom, scroll to the bottom again
        if (!focus || (focus && currentScroll === boxHeight)) scrollToBottom();
    }

    async function setMessages(_messages: Array<MessageData>) {
        messages = _messages;
        await tick();
        boxHeight = ref!.scrollHeight - ref!.clientHeight;
        if (!focus || (focus && currentScroll === boxHeight)) scrollToBottom('auto');
    }

    function clearMessages() {
        setMessages([]);
    }

    function toggleFocus(_focus: boolean) {
        focus = _focus;
        if (!_focus) scrollToBottom();
    }

    function scrollToTop(behavior: ScrollBehavior = 'smooth') {
        currentScroll = 0;
        ref?.scrollTo({ top: 0, behavior });
    }

    function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        currentScroll = boxHeight;
        ref?.scroll({ top: boxHeight, behavior });
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

    // --------------------------------------------------------------
    // Reactive Statments
    // --------------------------------------------------------------

    // TODO: Find better way to do this, because if the overflow gets bigger, the mask won't be noticeable
    $: maskTopHeight = currentScroll === 0 ? '0px' : `${Math.floor((64 * currentScroll) / boxHeight)}px`;
    $: maskBottomHeight =
        currentScroll === boxHeight ? '0px' : `${Math.floor((64 * (boxHeight - currentScroll)) / boxHeight)}px`;

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    onMount(() => {
        boxHeight = ref.scrollHeight - ref.clientHeight;
        scrollToBottom('auto');

        window?.alt?.on('vchat:loadHistory', setMessages);
        window?.alt?.on('vchat:message', addMessage);
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.on('vchat:clear', clearMessages);
    });

    onDestroy(() => {
        window?.alt?.off('vchat:loadHistory', setMessages);
        window?.alt?.off('vchat:message', addMessage);
        window?.alt?.off('vchat:focus', toggleFocus);
        window?.alt?.off('vchat:clear', clearMessages);
    });
</script>

<div
    class="flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2"
    class:opacity-50={!focus}
    class:opacity-100={focus}
    class:overflow-y-scroll={focus && ref.scrollHeight > ref.clientHeight}
    class:overflow-y-hidden={!focus}
    style:--mask-top-height={maskTopHeight}
    style:--mask-bottom-height={maskBottomHeight}
    bind:this={ref}
>
    {#each messages as message}
        <Message type={message.type}>{@html message.content}</Message>
    {/each}
</div>

<svelte:window on:keydown={handleKeydown} on:mousewheel|nonpassive|preventDefault={processScroll} />

<style lang="scss">
    @import 'Messages.scss';
</style>
