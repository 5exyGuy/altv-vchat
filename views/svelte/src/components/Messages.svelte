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
    let currentScroll: number = 0;
    let boxHeight: number = 0;
    let clientHeight: number = 0;
    let scrollHeight: number = 0;

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

    let ref: HTMLDivElement;

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
        messages = [...messages, { content: message, type }];
        await tick();
        scrollHeight = ref.scrollHeight;
        clientHeight = ref.clientHeight;
        boxHeight = scrollHeight - clientHeight;
        if ($focus || (!$focus && currentScroll === boxHeight)) return;
        scrollToBottom();
    }

    /**
     * Loads the messages from the client's local storage.
     * @param _messages The messages to load.
     */
    async function setMessages(_messages: Array<MessageData>) {
        messages = _messages;
        await tick();
        scrollHeight = ref.scrollHeight;
        clientHeight = ref.clientHeight;
        boxHeight = scrollHeight - clientHeight;
        if ($focus || (!$focus && currentScroll === boxHeight)) return;
        scrollToBottom();
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
        ref.scrollTo({ top: 0, behavior });
        currentScroll = 0;
    }

    /**
     * Scrolls the chat box to the bottom.
     * @param behavior Whether or not to scroll smoothly.
     */
    async function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        ref.scroll({ top: boxHeight, behavior });
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

    // Effects ------------------------------------------------------

    const unsubFocus = focus.subscribe((focus) => {
        if (focus || !ref) return;
        scrollToBottom();
    });

    // Mount --------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:loadMessageHistory', setMessages);
        window?.alt?.on('vchat:addMessage', addMessage);
        window?.alt?.on('vchat:clearMessages', clearMessages);
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => {
        unsubFocus();

        window?.alt?.off('vchat:loadMessageHistory', setMessages);
        window?.alt?.off('vchat:addMessage', addMessage);
        window?.alt?.off('vchat:clearMessages', clearMessages);
    });
</script>

<div
    class="scrollbar mask flex flex-col gap-[4px] h-[320px] w-full mb-[16px] pr-2"
    class:opacity-50={!$focus}
    class:opacity-100={$focus}
    style:--scrollbar-opacity={$focus && scrollHeight > clientHeight ? 1 : 0}
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
