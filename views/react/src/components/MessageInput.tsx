import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../stores/chat.store';
import { setMessage } from '../reducers/chat.reducer';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import classnames from 'classnames';

export function MessageInput({ focus = false, placeholder = 'Type a message...', prefix = '/' }) {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const message = useSelector((state: RootState) => state.chat.message);
    const dispatch = useDispatch();

    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

    const [buffer, setBuffer] = useState<Array<string>>([]);
    const [currentBufferIndex, setCurrentBufferIndex] = useState(-1);
    const [previuosMessage, setPreviuosMessage] = useState('');
    const [key, setKey] = useState('');
    const ref = useRef<HTMLInputElement>(null);

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    async function sendMessage(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            window?.alt?.emit('vchat:message', message);

            if (buffer.length > 100) buffer.shift();
            setBuffer([message, ...buffer]);
            setCurrentBufferIndex(-1);
            dispatch(setMessage(''));
        }
    }

    function handleKeydown(event: globalThis.KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        setKey(event.key);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    useEffect(() => (focus ? ref.current?.focus() : setCurrentBufferIndex(-1)), [focus]);

    useEffect(() => {
        if (message && message.startsWith(prefix)) return;
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

    return (
        <input
            className={classnames(
                'bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] focus:outline-none w-full',
                { invisible: !focus, visible: focus },
            )}
            placeholder={placeholder}
            value={message}
            onChange={(event) => dispatch(setMessage(event.target.value))}
            ref={ref}
            onKeyDown={(event) => sendMessage(event)}
            onBlur={(event) => event.currentTarget.focus()}
        />
    );
}
