import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/chat.store';
import { setMessage } from '../reducers/chat.reducer';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import classnames from 'classnames';

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
    const [key, setKey] = useState('');

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
        setKey(event.key);
        event.preventDefault();
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens to focus changes.
    // When focus is true, the input is focused.
    // When focus is false, sets the current message buffer index to -1.
    useEffect(() => (focus ? ref!.current!.focus() : setCurrentBufferIndex(-1)), [focus]);

    // Listends to key changes.
    useEffect(() => {
        if (!key) return;
        if (message && message.startsWith(options.cmdPrefix)) return;
        if (buffer.length === 0) return;

        if (key === 'ArrowDown') {
            if (currentBufferIndex > 0) {
                dispatch(setMessage(buffer[currentBufferIndex - 1]));
                setCurrentBufferIndex((currentBufferIndex) => currentBufferIndex - 1);
            } else if (currentBufferIndex === 0) {
                setCurrentBufferIndex(-1);
                dispatch(setMessage(previuosMessage));
            }
        } else if (key === 'ArrowUp') {
            if (currentBufferIndex < 0) setPreviuosMessage(message);
            if (currentBufferIndex < buffer.length - 1) {
                dispatch(setMessage(buffer[currentBufferIndex + 1]));
                setCurrentBufferIndex((currentBufferIndex) => currentBufferIndex + 1);
            }
        }

        setKey('');
    }, [key]);

    // Mount --------------------------------------------------------

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);

        // Unmount --------------------------------------------------

        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <input
            className={classnames(
                'bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] focus:outline-none w-full',
                { invisible: !focus, visible: focus },
            )}
            placeholder={options.inputPlaceholder}
            value={message}
            onChange={(event) => dispatch(setMessage(event.target.value))}
            ref={ref}
            onKeyDown={(event) => sendMessage(event)}
            onBlur={(event) => event.currentTarget.focus()}
        />
    );
}
