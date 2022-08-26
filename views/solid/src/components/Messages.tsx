import { MessageType } from '../enums';
import { Message as MessageData } from '../interfaces';
import { Message } from './Message';
import './Messages.scss';
import { createEffect, createSignal, For, JSX, onCleanup, onMount, mergeProps, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';

export function Messages(props: { focus: boolean; scrollStep: number }) {
    const merged = mergeProps({ focus: false, scrollStep: 20 }, props);

    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

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
        const scrollTo = currentScroll() - merged.scrollStep < 0 ? 0 : currentScroll() - merged.scrollStep;
        ref!.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
    }

    function scrollDown() {
        const scrollTo =
            currentScroll() + merged.scrollStep > boxHeight() ? boxHeight() : currentScroll() + merged.scrollStep;
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
        if (!merged.focus) return;
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

    createEffect(() => {
        !merged.focus && scrollToBottom();
    });

    createEffect(() => {
        const test = messages();
        // console.log(`length: ${test.length} scrollHeight: ${ref!.scrollHeight} boxHeight: ${ref!.clientHeight}`);
        setBoxHeight(ref!.scrollHeight - ref!.clientHeight); // TODO: Sets the wrong height. Is this a bug?
    });

    // createEffect(() => {
    //     if (merged.focus || (merged.focus && currentScroll() !== boxHeight()) || boxHeight() === 0) return;
    //     scrollToBottom();
    // });

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
        <>
            <div class="bg-white text-black">
                {currentScroll()}/{boxHeight()} | {ref?.scrollHeight}
            </div>
            <div
                class="flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2 overflow-y-scroll"
                // classList={{
                //     'opacity-50': !merged.focus,
                //     'opacity-100': merged.focus,
                //     'overflow-y-scroll': merged.focus && ref!.scrollHeight > ref!.clientHeight,
                //     'overflow-y-hidden': !merged.focus,
                // }}
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
        </>
    );
}
