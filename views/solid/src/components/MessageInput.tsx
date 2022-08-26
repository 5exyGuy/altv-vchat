import { batch, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js';
import { chatStore } from '../stores';

export function MessageInput() {
    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

    const { focus, message, setMessage, options } = chatStore;
    const [buffer, setBuffer] = createSignal([] as Array<string>);
    const [currentBufferIndex, setCurrentBufferIndex] = createSignal(-1);
    const [previuosMessage, setPreviuosMessage] = createSignal('');
    let ref: HTMLInputElement | undefined;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    function sendMessage(event: KeyboardEvent) {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        window?.alt?.emit('vchat:message', message());
        batch(() => {
            setBuffer((buffer) => [message(), ...buffer].splice(0, options.maxBufferLength));
            setCurrentBufferIndex(-1);
            setMessage('');
        });
    }

    function handleKeydown(event: globalThis.KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if (message && message().startsWith(options.prefix)) return;
        if (buffer.length === 0) return;

        if (event.key === 'ArrowDown') {
            if (currentBufferIndex() > 0) {
                batch(() => {
                    setMessage(buffer()[currentBufferIndex() - 1]);
                    setCurrentBufferIndex((currentBufferIndex) => currentBufferIndex - 1);
                });
            } else if (currentBufferIndex() === 0) {
                batch(() => {
                    setCurrentBufferIndex(-1);
                    setMessage(previuosMessage);
                });
            }
        } else if (event.key === 'ArrowUp') {
            if (currentBufferIndex() < 0) setPreviuosMessage(message());
            if (currentBufferIndex() < buffer().length - 1) {
                batch(() => {
                    setMessage(buffer()[currentBufferIndex() + 1]);
                    setCurrentBufferIndex((currentBufferIndex) => currentBufferIndex + 1);
                });
            }
        }

        event.preventDefault();
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    onMount(() => window.addEventListener('keydown', handleKeydown));

    onCleanup(() => window.removeEventListener('keydown', handleKeydown));

    createEffect(on(focus, () => (focus() ? ref!.focus() : setCurrentBufferIndex(-1))));

    return (
        <input
            class="bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] focus:outline-none w-full"
            classList={{ invisible: !focus(), visible: focus() }}
            placeholder={options.placeholder}
            value={message()}
            onInput={(event) => setMessage(event.currentTarget.value)}
            ref={ref}
            onKeyDown={sendMessage}
            onBlur={(event) => event.currentTarget.focus()}
        />
    );
}
