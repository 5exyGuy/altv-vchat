import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { MessageType } from '../enums';
import type { Message as MessageData } from '../interfaces';
import { Message } from './Message';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/stores/chat.store';
import './Messages.scss';

export function Messages() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const focus = useSelector((state: RootState) => state.chat.focus);
    const options = useSelector((state: RootState) => state.chat.options);

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    const [messages, setMessages] = useState([] as Array<MessageData>);
    const [currentScroll, setCurrentScroll] = useState(0);
    const [boxHeight, setBoxHeight] = useState(0);
    const [clientHeight, setClientHeight] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [deltaY, setDeltaY] = useState(0);
    const [key, setKey] = useState('');

    // --------------------------------------------------------------
    // Computed Local Values
    // --------------------------------------------------------------

    const maskTopHeight = useMemo(
        () => (currentScroll === 0 ? '0px' : `${Math.floor((64 * currentScroll) / boxHeight)}px`),
        [currentScroll, boxHeight],
    );
    const maskBottomHeight = useMemo(
        () => (currentScroll === boxHeight ? '0px' : `${Math.floor((64 * (boxHeight - currentScroll)) / boxHeight)}px`),
        [currentScroll, boxHeight],
    );

    // --------------------------------------------------------------
    // Refs
    // --------------------------------------------------------------

    const ref = useRef<HTMLDivElement>(null);

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
        setMessages((messages) => [...messages, { content: message, type }]);
    }

    /**
     * Loads the messages from the client's local storage.
     * @param messages The messages to load.
     */
    async function loadMessageHistory(messages: Array<MessageData>) {
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
        ref.current!.scrollTo({ top: 0, behavior });
        setCurrentScroll(0);
    }

    /**
     * Scrolls the chat box to the bottom.
     * @param behavior Whether or not to scroll smoothly.
     */
    function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
        ref.current!.scroll({ top: boxHeight, behavior });
        setCurrentScroll(boxHeight);
    }

    function scrollTo(top: number, behavior: ScrollBehavior = 'smooth') {
        ref.current!.scroll({ top, behavior });
        setCurrentScroll(top);
    }

    /**
     * Scrolls the chat box up by the specified amount in the chat store.
     */
    function scrollUp() {
        const scrollTo = currentScroll - options.scrollStep < 0 ? 0 : currentScroll - options.scrollStep;
        ref.current!.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
        setDeltaY(0);
    }

    /**
     * Scrolls the chat box down by the specified amount in the chat store.
     */
    function scrollDown() {
        const scrollTo =
            currentScroll + options.scrollStep > boxHeight ? boxHeight : currentScroll + options.scrollStep;
        ref.current!.scrollTop = scrollTo;
        setCurrentScroll(scrollTo);
        setDeltaY(0);
    }

    /**
     * Scrolls the chat box to the specified position.
     * @param event The keyboard event.
     */
    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'PageUp' && event.key !== 'PageDown' && event.key !== 'Home' && event.key !== 'End') return;
        setKey(event.key);
        event.preventDefault();
    }

    /**
     * Scrolls the chat box to the specified position.
     * @param event The mouse wheel event.
     */
    function processScroll(event: WheelEvent) {
        setDeltaY(event.deltaY);
        event.preventDefault();
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens to focus changes.
    // If the chat box is not focused, it scrolls to the bottom.
    useEffect(() => {
        if (focus || !ref) return;
        scrollToBottom();
    }, [focus]);

    // Listens to messages changes.
    // Sets the new height of the chat box.
    useEffect(() => {
        if (messages.length === 0) return;
        setClientHeight(ref.current!.clientHeight);
        setScrollHeight(ref.current!.scrollHeight);
        setBoxHeight(ref.current!.scrollHeight - ref.current!.clientHeight);
        if (focus || (!focus && currentScroll === ref.current!.scrollHeight - ref.current!.clientHeight)) return;
        scrollTo(ref.current!.scrollHeight - ref.current!.clientHeight);
    }, [messages]);

    // Listens to scroll delta changes.
    useEffect(() => {
        if (!focus) return;
        if (deltaY === 0) return;
        deltaY < 0 ? scrollUp() : scrollDown();
    }, [deltaY]);

    // Listens to key changes.
    useEffect(() => {
        if (!key) return;
        if (key === 'PageUp') scrollUp();
        else if (key === 'PageDown') scrollDown();
        else if (key === 'Home') scrollToTop();
        else if (key === 'End') scrollToBottom();
        setKey('');
    }, [key]);

    function bind() {
        // window.addEventListener('keydown', handleKeydown.bind());
    }

    // Mount --------------------------------------------------------

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('wheel', processScroll, { passive: false });

        window?.alt?.on('vchat:loadMessageHistory', loadMessageHistory);
        window?.alt?.on('vchat:addMessage', addMessage);
        window?.alt?.on('vchat:clearMessages', clearMessages);
        // Unmount --------------------------------------------------

        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('wheel', processScroll);

            window?.alt?.off('vchat:loadMessageHistory', loadMessageHistory);
            window?.alt?.off('vchat:addMessage', addMessage);
            window?.alt?.off('vchat:clearMessages', clearMessages);
        };
    }, []);

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            className={classnames('scrollbar mask flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2', {
                'opacity-50': !focus,
                'opacity-100': focus,
            })}
            style={
                {
                    '--scrollbar-opacity': focus && scrollHeight > clientHeight ? 1 : 0,
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
