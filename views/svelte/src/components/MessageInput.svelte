<script lang="ts">
    import { useChatStore } from '../stores';
    import { onDestroy, tick } from 'svelte';

    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, message, setMessage, options } = useChatStore();

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    let buffer: Array<string> = [];
    let currentBufferIndex: number = -1;
    let previousMessage: string = '';

    // --------------------------------------------------------------
    // Refs
    // --------------------------------------------------------------

    let ref: HTMLInputElement;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Sending messages ---------------------------------------------

    /**
     * Sends the message to the server if ENTER is pressed.
     * @param event The keyborad event.
     */
    async function sendMessage(event: KeyboardEvent) {
        if (event.key !== 'Enter') return;

        window?.alt?.emit('vchat:addMessage', $message.trim());
        buffer = [$message, ...buffer].splice(0, $options.maxMessageBufferLength);
        currentBufferIndex = -1;
        setMessage('');

        event.preventDefault();
    }

    // Message buffer -----------------------------------------------

    /**
     * Selects the previous message in the buffer depending on the key pressed.
     * @param event The keyboard event.
     */
    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if (buffer.length === 0) return;

        if (event.key === 'ArrowDown') {
            if (currentBufferIndex > 0) {
                $message = buffer[--currentBufferIndex];
            } else if (currentBufferIndex === 0) {
                currentBufferIndex = -1;
                $message = previousMessage;
            }
        } else if (event.key === 'ArrowUp') {
            if (currentBufferIndex < 0) previousMessage = $message;
            if (currentBufferIndex < buffer.length - 1) {
                $message = buffer[++currentBufferIndex];
            }
        }

        event.preventDefault();
    }

    function processInputChange(event: Event) {
        const value = (event.currentTarget as HTMLInputElement).value;
        if ($options.maxMessageLength !== 0 && value.length > $options.maxMessageLength) {
            setMessage(value.slice(0, $options.maxMessageLength));
            return;
        }
        setMessage(value);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens to options changes.
    const unsubOptions = options.subscribe((options) => {
        if ($message.length > options.maxMessageLength) setMessage($message.slice(0, options.maxMessageLength));
        if (buffer.length > options.maxMessageBufferLength) {
            buffer = buffer.slice(0, options.maxMessageBufferLength);
            currentBufferIndex = -1;
        }
    });

    // Listens to focus changes.
    // When focus is true, the input is focused.
    // When focus is false, sets the current message buffer index to -1.
    const unsubFocus = focus.subscribe(async (focus) => {
        if (focus) {
            await tick();
            ref!.focus();
        } else currentBufferIndex = -1;
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => {
        unsubOptions();
        unsubFocus();
    });
</script>

<div
    class="flex gap-4 bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] w-full"
    class:invisible={!$focus}
    class:visible={$focus}
>
    <input
        class="bg-transparent focus:outline-none w-full"
        placeholder={$options.placeholder}
        bind:value={$message}
        bind:this={ref}
        on:input={processInputChange}
        on:keydown={sendMessage}
        on:blur={(event) => event.currentTarget.focus()}
    />
    <span class="text-white text-opacity-50">
        {$message.length}/{$options.maxMessageLength}
    </span>
</div>

<svelte:window on:keydown={handleKeydown} />
