import { MessageType } from '../enums';
import type { Message as MessageData } from '../interfaces';
import { Message } from './Message';
import { createSignal, For, JSX, onCleanup, onMount, createMemo, on, createEffect } from 'solid-js';
import { chatStore } from '../stores';
import './Messages.scss';

export function Messages() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------
    const { focus, options } = chatStore;

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    const [messages, setMessages] = createSignal<Array<MessageData>>([]);
    const [boxHeight, setBoxHeight] = createSignal<number>(0);
    const [currentScroll, setCurrentScroll] = createSignal<number>(0);

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
    function addMessage(message: string, type: MessageType = MessageType.Default) {
        setMessages((messages) => [...messages, { content: message, type }]);
    }

    /**
     * Loads the messages from the client's local storage.
     * @param messages The messages to load.
     */
    function loadMessages(messages: Array<MessageData>) {
        setMessages(messages);
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
        setCurrentScroll(0);
    }

    /**
     * Scrolls the chat box to the bottom.
     * @param behavior Whether or not to scroll smoothly.
     */
    function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        ref!.scroll({ top: boxHeight(), behavior });
        setCurrentScroll(boxHeight());
    }

    /**
     * Scrolls the chat box up by the specified amount in the chat store.
     */
    function scrollUp() {
        const scrollTo = currentScroll() - options.scrollStep < 0 ? 0 : currentScroll() - options.scrollStep;
        ref!.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
    }

    /**
     * Scrolls the chat box down by the specified amount in the chat store.
     */
    function scrollDown() {
        const scrollTo =
            currentScroll() + options.scrollStep > boxHeight() ? boxHeight() : currentScroll() + options.scrollStep;
        ref!.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
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
    function processScroll(event: WheelEvent) {
        event.preventDefault();
        if (!focus()) return;
        if (event.deltaY === 0) return;
        event.deltaY < 0 ? scrollUp() : scrollDown();
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens to focus changes.
    // If the chat box is not focused, it scrolls to the bottom.
    createEffect(on(focus, (focus) => !focus && scrollToBottom()));

    // Listens to messages changes.
    // Sets the new height of the chat box.
    // Scrolls to the bottom if the chat box is not focused.
    createEffect(
        on(messages, () => {
            setBoxHeight(ref!.scrollHeight - ref!.clientHeight);
            if (focus() || (focus() && currentScroll() !== boxHeight()) || boxHeight() === 0) return;
            scrollToBottom();
        }),
    );

    // Mount --------------------------------------------------------

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('wheel', processScroll, { passive: false });

        window?.alt?.on('vchat:loadHistory', loadMessages);
        window?.alt?.on('vchat:message', addMessage);
        window?.alt?.on('vchat:clear', clearMessages);
    });

    // Unmount ------------------------------------------------------

    onCleanup(() => {
        window.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('wheel', processScroll);

        window?.alt?.off('vchat:loadHistory', loadMessages);
        window?.alt?.off('vchat:message', addMessage);
        window?.alt?.off('vchat:clear', clearMessages);
    });

    // --------------------------------------------------------------
    // Computed values using useMemo hook
    // --------------------------------------------------------------

    const maskTopHeight = createMemo(() =>
        currentScroll() === 0 ? '0px' : `${Math.floor((64 * currentScroll()) / boxHeight())}px`,
    );
    const maskBottomHeight = createMemo(() =>
        currentScroll === boxHeight ? '0px' : `${Math.floor((64 * (boxHeight() - currentScroll())) / boxHeight())}px`,
    );

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            class="flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2 overflow-y-scroll"
            classList={{
                'opacity-50': !focus(),
                'opacity-100': focus(),
                'overflow-y-scroll': focus() && ref!.scrollHeight > ref!.clientHeight,
                'overflow-y-hidden': !focus(),
            }}
            style={
                {
                    '--mask-top-height': maskTopHeight(),
                    '--mask-bottom-height': maskBottomHeight(),
                } as JSX.CSSProperties
            }
            ref={ref}
        >
            <For each={messages()}>{(message) => <Message content={message.content} type={message.type} />}</For>
        </div>
    );
}
