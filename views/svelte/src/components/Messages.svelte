<script lang="ts">
    import type { Message as MessageData } from '../interfaces';
    import { onDestroy, onMount, tick } from 'svelte';
    import Message from './Message.svelte';
    import { MessageType } from '../enums';
    import { useChatStore } from '../stores';

    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, options } = useChatStore();

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    let messages: Array<MessageData> = [];
    let boxHeight: number = 0;
    let currentScroll: number = 0;

    // --------------------------------------------------------------
    // Computed Local Values
    // --------------------------------------------------------------

    // TODO: Find better way to do this, because if the overflow gets bigger, the mask won't be noticeable
    $: maskTopHeight = currentScroll === 0 ? '0px' : `${Math.floor((64 * currentScroll) / boxHeight)}px`;
    $: maskBottomHeight =
        currentScroll === boxHeight ? '0px' : `${Math.floor((64 * (boxHeight - currentScroll)) / boxHeight)}px`;

    // --------------------------------------------------------------
    // Refs
    // --------------------------------------------------------------

    let ref: HTMLDivElement | undefined;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Messages -----------------------------------------------------

    /**
     * Adds a message to the chat box sent by the server.
     * @param message The message to add.
     * @param type The type of message.
     */
    async function addMessage(message: string, type: MessageType = MessageType.Default) {
        messages = [...messages, { content: message, type }]; // Add message to array
        await tick(); // Wait for next tick
        boxHeight = ref!.scrollHeight - ref!.clientHeight; // Get height of box
        // If the box is focused and previous scroll was at the bottom, scroll to the bottom again
        if (!focus || (focus && currentScroll === boxHeight)) scrollToBottom();
    }

    /**
     * Loads the messages from the client's local storage.
     * @param _messages The messages to load.
     */
    async function setMessages(_messages: Array<MessageData>) {
        messages = _messages;
        await tick();
        boxHeight = ref!.scrollHeight - ref!.clientHeight;
        if (!focus || (focus && currentScroll === boxHeight)) scrollToBottom('auto');
    }

    /**
     * Clears the messages from the chat box sent by the server.
     */
    function clearMessages() {
        setMessages([]);
    }

    // Scrolling ----------------------------------------------------

    /**
     * Scrolls the chat box to the top.
     * @param behavior Whether or not to scroll smoothly.
     */
    function scrollToTop(behavior: ScrollBehavior = 'smooth') {
        ref!.scrollTo({ top: 0, behavior });
        currentScroll = 0;
    }

    /**
     * Scrolls the chat box to the bottom.
     * @param behavior Whether or not to scroll smoothly.
     */
    function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        ref!.scroll({ top: boxHeight, behavior });
        currentScroll = boxHeight;
    }

    /**
     * Scrolls the chat box up by the specified amount in the chat store.
     */
    function scrollUp() {
        const scrollTo = currentScroll - $options.scrollStep < 0 ? 0 : currentScroll - $options.scrollStep;
        ref!.scrollTop = scrollTo;
        currentScroll = scrollTo;
    }

    /**
     * Scrolls the chat box down by the specified amount in the chat store.
     */
    function scrollDown() {
        const scrollTo =
            currentScroll + $options.scrollStep > boxHeight ? boxHeight : currentScroll + $options.scrollStep;
        ref!.scrollTop = scrollTo;
        currentScroll = scrollTo;
    }

    /**
     * Scrolls the chat box to the specified position.
     * @param event The keyboard event.
     */
    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'PageUp' && event.key !== 'PageDown' && event.key !== 'Home' && event.key !== 'End') return;

        if (event.key === 'PageUp') scrollUp();
        else if (event.key === 'PageDown') scrollDown();
        else if (event.key === 'Home') scrollToTop();
        else if (event.key === 'End') scrollToBottom();

        event.preventDefault();
    }

    /**
     * Scrolls the chat box to the specified position.
     * @param event The mouse wheel event.
     */
    async function processScroll(event: WheelEvent) {
        event.preventDefault();
        if (!$focus) return;
        event.deltaY < 0 ? scrollUp() : scrollDown();
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------
    onMount(() => {
        window?.alt?.on('vchat:loadHistory', setMessages);
        window?.alt?.on('vchat:message', addMessage);
        window?.alt?.on('vchat:clear', clearMessages);
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => {
        window?.alt?.off('vchat:loadHistory', setMessages);
        window?.alt?.off('vchat:message', addMessage);
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
        <Message content={message.content} type={message.type} />
    {/each}
</div>

<svelte:window on:keydown={handleKeydown} on:mousewheel|nonpassive|preventDefault={processScroll} />

<style lang="scss">
    @import 'Messages.scss';
</style>
