import { CSSProperties, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { MessageType } from '../enums';
import { Message as MessageData } from '../interfaces';
import { Message } from './Message';
import classnames from 'classnames';
import './Messages.scss';

export function Messages({ focus = false, scrollStep = 20 }) {
    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

    const [messages, setMessages] = useState<Array<MessageData>>([]);
    const [boxHeight, setBoxHeight] = useState(0);
    const [currentScroll, setCurrentScroll] = useState(0);
    const [deltaY, setDeltaY] = useState(0);
    const [key, setKey] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    async function addMessage(message: string, type: MessageType = MessageType.Default) {
        setMessages((messages) => [...messages, { content: message, type }]);
    }

    async function loadMessages(messages: Array<MessageData>) {
        setMessages(messages);
    }

    function clearMessages() {
        setMessages([]);
    }

    function scrollToTop(behavior: ScrollBehavior = 'smooth') {
        ref?.current?.scrollTo({ top: 0, behavior });
        setCurrentScroll(0);
    }

    function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        ref?.current?.scroll({ top: boxHeight, behavior });
        setCurrentScroll(boxHeight);
    }

    function scrollUp() {
        const scrollTo = currentScroll - scrollStep < 0 ? 0 : currentScroll - scrollStep;
        if (ref?.current?.scrollTop === undefined) return;
        ref.current.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
        setDeltaY(0);
    }

    function scrollDown() {
        const scrollTo = currentScroll + scrollStep > boxHeight ? boxHeight : currentScroll + scrollStep;
        if (ref?.current?.scrollTop === undefined) return;
        ref.current.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
        setDeltaY(0);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'PageUp' && event.key !== 'PageDown' && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        setKey(event.key);
    }

    function processScroll(event: WheelEvent) {
        event.preventDefault();
        setDeltaY(event.deltaY);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('wheel', processScroll, { passive: false });

        window?.alt?.on('vchat:loadHistory', loadMessages);
        window?.alt?.on('vchat:message', addMessage);
        window?.alt?.on('vchat:clear', clearMessages);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('wheel', processScroll);

            window?.alt?.off('vchat:loadHistory', loadMessages);
            window?.alt?.off('vchat:message', addMessage);
            window?.alt?.off('vchat:clear', clearMessages);
        };
    }, []);

    useEffect(() => {
        !focus && scrollToBottom();
    }, [focus]);

    useEffect(() => {
        if (messages.length === 0) return;
        setBoxHeight(ref!.current!.scrollHeight - ref!.current!.clientHeight);
    }, [messages]);

    useEffect(() => {
        if (focus || (focus && currentScroll !== boxHeight) || boxHeight === 0) return;
        scrollToBottom();
    }, [boxHeight]);

    useEffect(() => {
        if (!focus) return;
        if (deltaY === 0) return;
        deltaY < 0 ? scrollUp() : scrollDown();
    }, [deltaY]);

    useEffect(() => {
        if (!key) return;
        if (key === 'PageUp') scrollUp();
        else if (key === 'PageDown') scrollDown();
        else if (key === 'Home') scrollToTop();
        else if (key === 'End') scrollToBottom();
        setKey('');
    }, [key]);

    // --------------------------------------------------------------
    // Computed values using useMemo hook
    // --------------------------------------------------------------

    const maskTopHeight = useMemo(
        () => (currentScroll === 0 ? '0px' : `${Math.floor((64 * currentScroll) / boxHeight)}px`),
        [currentScroll, boxHeight],
    );
    const maskBottomHeight = useMemo(
        () => (currentScroll === boxHeight ? '0px' : `${Math.floor((64 * (boxHeight - currentScroll)) / boxHeight)}px`),
        [currentScroll, boxHeight],
    );

    return (
        <div
            className={classnames('flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2', {
                'opacity-50': !focus,
                'opacity-100': focus,
                'overflow-y-scroll': focus && ref!.current!.scrollHeight > ref!.current!.clientHeight,
                'overflow-y-hidden': !focus,
            })}
            style={
                {
                    '--mask-top-height': maskTopHeight,
                    '--mask-bottom-height': maskBottomHeight,
                } as CSSProperties
            }
            ref={ref}
        >
            {messages.map((message, index) => (
                <Message key={index} content={message.content} type={message.type} />
            ))}
        </div>
    );
}
