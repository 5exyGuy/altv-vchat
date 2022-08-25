import { useEffect, useState } from 'react';
import { Commands } from './components/Commands';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';

export function ChatBox() {
    const [focus, setFocus] = useState(false);

    function toggleFocus(focus: boolean) {
        setFocus(focus);
    }

    useEffect(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.emit('vchat:mounted');

        return () => {
            window?.alt?.off('vchat:focus', toggleFocus);
        };
    }, []);

    return (
        <div className="fixed top-[16px] left-[16px] w-[640px]">
            <Messages focus={focus} />
            <MessageInput focus={focus} />
            <Commands focus={focus} />
        </div>
    );
}
