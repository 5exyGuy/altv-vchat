import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/chat.store';
import { setMessage } from '../reducers/chat.reducer';
import { type ChangeEvent, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import classnames from 'classnames';
import useWindowEvent from '../hooks/window-event.hook';

export function MessageInput() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const focus = useSelector((state: RootState) => state.chat.focus);
    const message = useSelector((state: RootState) => state.chat.message);
    const options = useSelector((state: RootState) => state.chat.options);
    const dispatch = useDispatch();

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    const [buffer, setBuffer] = useState([] as Array<string>);
    const [currentBufferIndex, setCurrentBufferIndex] = useState(-1);
    const [previuosMessage, setPreviuosMessage] = useState('');

    // --------------------------------------------------------------
    // Refs
    // --------------------------------------------------------------

    const ref = useRef<HTMLInputElement>(null);

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Sending messages ---------------------------------------------

    /**
     * Sends the message to the server if ENTER is pressed.
     * @param event The keyborad event.
     */
    async function sendMessage(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key !== 'Enter') return;

        window?.alt?.emit('vchat:addMessage', message);
        setBuffer((buffer) => [message, ...buffer].splice(0, options.maxMessageBufferLength));
        setCurrentBufferIndex(-1);
        dispatch(setMessage(''));

        event.preventDefault();
    }

    // Message buffer -----------------------------------------------

    /**
     * Selects the previous message in the buffer depending on the key pressed.
     * @param event The keyboard event.
     */
    function handleKeydown(event: globalThis.KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if (message && message.startsWith(options.prefix)) return;
        if (buffer.length === 0) return;

        if (event.key === 'ArrowDown') {
            if (currentBufferIndex > 0) {
                setMessage(buffer[currentBufferIndex - 1]);
                setCurrentBufferIndex((currentBufferIndex) => currentBufferIndex - 1);
            } else if (currentBufferIndex === 0) {
                setCurrentBufferIndex(-1);
                setMessage(previuosMessage);
            }
        } else if (event.key === 'ArrowUp') {
            if (currentBufferIndex < 0) setPreviuosMessage(message);
            if (currentBufferIndex < buffer.length - 1) {
                setMessage(buffer[currentBufferIndex + 1]);
                setCurrentBufferIndex((currentBufferIndex) => currentBufferIndex + 1);
            }
        }

        event.preventDefault();
    }

    // Message input processing -------------------------------------

    /**
     * Updates the current message.
     * @param event The change event.
     */
    function processInputChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (options.maxMessageLength !== 0 && value.length > options.maxMessageLength) return;
        dispatch(setMessage(event.target.value));
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens to options changes.
    useEffect(() => {
        if (message.length > options.maxMessageLength) dispatch(setMessage(message.slice(0, options.maxMessageLength)));
        if (buffer.length > options.maxMessageBufferLength) {
            setBuffer(buffer.slice(0, options.maxMessageBufferLength));
            setCurrentBufferIndex(-1);
        }
    }, [options]);

    // Listens to focus changes.
    // When focus is true, the input is focused.
    // When focus is false, sets the current message buffer index to -1.
    useEffect(() => (focus ? ref.current!.focus() : setCurrentBufferIndex(-1)), [focus]);

    // Events -------------------------------------------------------

    useWindowEvent('keydown', handleKeydown);

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            className={classnames('flex gap-4 bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] w-full', {
                invisible: !focus,
                visible: focus,
            })}
        >
            <input
                className="bg-transparent focus:outline-none w-full"
                placeholder={options.placeholder}
                value={message}
                onChange={processInputChange}
                ref={ref}
                onKeyDown={sendMessage}
                onBlur={(event) => event.currentTarget.focus()}
            />
            {options.maxMessageLength > 0 && (
                <span className="text-white text-opacity-50">
                    {message.length}/{options.maxMessageLength}
                </span>
            )}
        </div>
    );
}
