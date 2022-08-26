import { createSignal, onCleanup, onMount } from 'solid-js';
// import { Commands } from './components/Commands';
// import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';

export function ChatBox() {
    const [focus, setFocus] = createSignal(false);

    function toggleFocus(focus: boolean) {
        setFocus(focus);
    }

    onMount(() => {
        window?.alt?.emit('vchat:mounted');
        window?.alt?.on('vchat:focus', toggleFocus);
    });

    onCleanup(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
    });

    return (
        <div class="fixed top-[16px] left-[16px] w-[640px]">
            <Messages focus={focus()} scrollStep={20} />
            {/* <MessageInput /> */}
            {/* <Commands /> */}
        </div>
    );
}
