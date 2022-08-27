import { onCleanup, onMount } from 'solid-js';
import { CommandSuggestions } from './components/CommandSuggestions';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';
import { chatStore } from './stores';

export function ChatBox() {
    const { setFocus } = chatStore;

    function toggleFocus(focus: boolean) {
        setFocus(focus);
    }

    onMount(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        // window?.alt?.on('vchat:loadSettings', loadSettings);
        window?.alt?.emit('vchat:mounted');
    });

    onCleanup(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
        // window?.alt?.off('vchat:loadSettings', loadSettings);
    });

    return (
        <div class="fixed top-[16px] left-[16px] w-[640px]">
            <Messages />
            <MessageInput />
            <CommandSuggestions />
        </div>
    );
}
