import { MessageType } from '../enums';
import type { Message as MessageData } from '../interfaces';
import { Message } from './Message';
import { createSignal, For, JSX, onCleanup, onMount, createMemo, on, createEffect } from 'solid-js';
import { chatStore } from '../stores';
import './Messages.scss';

export function Messages() {
    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

    const { focus, options } = chatStore;
    const [messages, setMessages] = createSignal<Array<MessageData>>([]);
    const [boxHeight, setBoxHeight] = createSignal(0);
    const [currentScroll, setCurrentScroll] = createSignal(0);
    let ref: HTMLDivElement | undefined;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    function addMessage(message: string, type: MessageType = MessageType.Default) {
        setMessages((messages) => [...messages, { content: message, type }]);
    }

    function loadMessages(messages: Array<MessageData>) {
        setMessages(messages);
    }

    function clearMessages() {
        setMessages([]);
    }

    function scrollToTop(behavior: ScrollBehavior = 'smooth') {
        ref!.scrollTo({ top: 0, behavior });
        setCurrentScroll(0);
    }

    function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        ref!.scroll({ top: boxHeight(), behavior });
        setCurrentScroll(boxHeight());
    }

    function scrollUp() {
        const scrollTo = currentScroll() - options.scrollStep < 0 ? 0 : currentScroll() - options.scrollStep;
        ref!.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
    }

    function scrollDown() {
        const scrollTo =
            currentScroll() + options.scrollStep > boxHeight() ? boxHeight() : currentScroll() + options.scrollStep;
        ref!.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
    }

    function handleKeydown(event: KeyboardEvent) {
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

    function processScroll(event: WheelEvent) {
        event.preventDefault();
        if (!focus()) return;
        if (event.deltaY === 0) return;
        event.deltaY < 0 ? scrollUp() : scrollDown();
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('wheel', processScroll, { passive: false });

        window?.alt?.on('vchat:loadHistory', loadMessages);
        window?.alt?.on('vchat:message', addMessage);
        window?.alt?.on('vchat:clear', clearMessages);
    });

    onCleanup(() => {
        window.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('wheel', processScroll);

        window?.alt?.off('vchat:loadHistory', loadMessages);
        window?.alt?.off('vchat:message', addMessage);
        window?.alt?.off('vchat:clear', clearMessages);
    });

    createEffect(on(focus, (focus) => !focus && scrollToBottom()));

    createEffect(
        on(messages, () => {
            setBoxHeight(ref!.scrollHeight - ref!.clientHeight);
            if (focus() || (focus() && currentScroll() !== boxHeight()) || boxHeight() === 0) return;
            scrollToBottom();
        }),
    );

    // --------------------------------------------------------------
    // Computed values using useMemo hook
    // --------------------------------------------------------------

    const maskTopHeight = createMemo(() =>
        currentScroll() === 0 ? '0px' : `${Math.floor((64 * currentScroll()) / boxHeight())}px`,
    );
    const maskBottomHeight = createMemo(() =>
        currentScroll === boxHeight ? '0px' : `${Math.floor((64 * (boxHeight() - currentScroll())) / boxHeight())}px`,
    );

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
