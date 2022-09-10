import { batch, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js';
import { chatStore } from '../stores';

export function MessageInput() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, message, setMessage, options } = chatStore;

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    const [buffer, setBuffer] = createSignal([] as Array<string>);
    const [currentBufferIndex, setCurrentBufferIndex] = createSignal(-1);
    const [previuosMessage, setPreviuosMessage] = createSignal('');

    // --------------------------------------------------------------
    // Refs
    // --------------------------------------------------------------

    let ref: HTMLInputElement | undefined;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Sending messages ---------------------------------------------

    /**
     * Sends the message to the server if ENTER is pressed.
     * @param event The keyborad event.
     */
    function sendMessage(event: KeyboardEvent) {
        if (event.key !== 'Enter') return;

        window?.alt?.emit('vchat:addMessage', message());
        batch(() => {
            setBuffer((buffer) => [message(), ...buffer].splice(0, options().maxMessageBufferLength));
            setCurrentBufferIndex(-1);
            setMessage('');
        });

        event.preventDefault();
    }

    // Message buffer -----------------------------------------------

    /**
     * Selects the previous message in the buffer depending on the key pressed.
     * @param event The keyboard event.
     */
    function selectPreviousMessage(event: KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if (message() && message().startsWith(options().prefix)) return;
        if (buffer().length === 0) return;

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

    // Message input processing -------------------------------------

    /**
     * Updates the current message.
     * @param event The change event.
     */
    function processInputChange(
        event: Event & {
            currentTarget: HTMLInputElement;
            target: Element;
        },
    ) {
        const value = event.currentTarget.value;
        if (options().maxMessageLength !== 0 && value.length > options().maxMessageLength) {
            ref!.value = message();
            return;
        }
        setMessage(value);
        ref!.value = value;
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens to options changes.
    createEffect(
        on(options, (options) => {
            if (message().length > options.maxMessageLength) setMessage(message().slice(0, options.maxMessageLength));
            if (buffer().length > options.maxMessageBufferLength) {
                setBuffer(buffer().slice(0, options.maxMessageBufferLength));
                setCurrentBufferIndex(-1);
            }
        }),
    );

    // Listens to focus changes.
    // When focus is true, the input is focused.
    // When focus is false, sets the current message buffer index to -1.
    createEffect(on(focus, () => (focus() ? ref!.focus() : setCurrentBufferIndex(-1))));

    // Mount --------------------------------------------------------

    onMount(() => window.addEventListener('keydown', selectPreviousMessage));

    // Unmount ------------------------------------------------------

    onCleanup(() => window.removeEventListener('keydown', selectPreviousMessage));

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            class="flex gap-4 bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] w-full"
            classList={{ invisible: !focus(), visible: focus() }}
        >
            <input
                class="bg-transparent focus:outline-none w-full"
                placeholder={options().placeholder}
                value={message()}
                onInput={processInputChange}
                ref={ref}
                onKeyDown={sendMessage}
                onBlur={(event) => event.currentTarget.focus()}
            />
            <span class="text-white text-opacity-50">
                {message().length}/{options().maxMessageLength}
            </span>
        </div>
    );
}
