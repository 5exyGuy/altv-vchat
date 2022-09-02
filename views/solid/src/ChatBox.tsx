import { onCleanup, onMount } from 'solid-js';
import { CommandSuggestions } from './components/CommandSuggestions';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';
import { chatStore } from './stores';

export function ChatBox() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { setFocus, options, setOptions } = chatStore;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Focus --------------------------------------------------------

    /**
     * Toggle focus on the chat box.
     * @param focus Whether the chat box is focused.
     */
    function toggleFocus(focus: boolean) {
        setFocus(focus);
    }

    /**
     * Syncs the client settings with the server settings.
     * @param settings The chat window's settings.
     */
    function syncSettings(settings: typeof options) {
        setOptions(settings);
        window?.alt?.emit('vchat:mounted');
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.on('vchat:syncSettings', syncSettings);
        window?.alt.emit('vchat:requestSettings');
    });

    // Unmount ------------------------------------------------------

    onCleanup(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
        window?.alt?.off('vchat:loadSettings', syncSettings);
    });

    return (
        <div class="fixed top-[16px] left-[16px] w-[640px]">
            <Messages />
            <MessageInput />
            <CommandSuggestions />
        </div>
    );
}
