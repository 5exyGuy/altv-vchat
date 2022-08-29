<script lang="ts">
    import { useChatStore } from '../stores';
    import { onDestroy, tick } from 'svelte';

    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, message, options } = useChatStore();

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    let buffer = [] as Array<string>;
    let currentBufferIndex = -1;
    let previousMessage = '';

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
        if (event.key === 'Enter') {
            event.preventDefault();
            window?.alt?.emit('vchat:message', message);

            buffer = [$message, ...buffer].splice(0, $options.maxMessageBufferLength);
            currentBufferIndex = -1;
            $message = '';
        }
    }

    // Message buffer -----------------------------------------------

    /**
     * Selects the previous message in the buffer depending on the key pressed.
     * @param event The keyboard event.
     */
    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if ($message && $message.startsWith($options.cmdPrefix)) return;
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

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens to focus changes.
    // When focus is true, the input is focused.
    // When focus is false, sets the current message buffer index to -1.
    const unsubFocus = focus.subscribe(async (focus) => {
        if (focus) {
            await tick();
            ref?.focus();
        } else currentBufferIndex = -1;
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => unsubFocus());
</script>

<input
    class="bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] focus:outline-none w-full"
    class:invisible={!$focus}
    class:visible={$focus}
    placeholder={$options.inputPlaceholder}
    bind:value={$message}
    bind:this={ref}
    on:keydown={sendMessage}
    on:blur={() => ref.focus()}
/>

<svelte:window on:keydown={handleKeydown} />
