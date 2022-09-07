import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CommandSuggestions } from './components/CommandSuggestions';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';
import type { Options } from './interfaces';
import { setFocus, setOptions } from './reducers/chat.reducer';

export function ChatBox() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const dispatch = useDispatch();

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Focus --------------------------------------------------------

    /**
     * Toggle focus on the chat box.
     * @param focus Whether the chat box is focused.
     */
    function toggleFocus(focus: boolean) {
        dispatch(setFocus(focus));
    }

    /**
     * Syncs the client settings with the server settings.
     * @param settings The chat window's settings.
     */
    function syncSettings(settings: Options) {
        dispatch(setOptions(settings));
        window?.alt?.emit('vchat:mounted');
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------

    useEffect(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.on('vchat:syncSettings', syncSettings);
        window?.alt.emit('vchat:requestSettings');

        // Unmount --------------------------------------------------

        return () => {
            window?.alt?.off('vchat:focus', toggleFocus);
            window?.alt?.off('vchat:loadSettings', syncSettings);
        };
    }, []);

    return (
        <div className="fixed top-[16px] left-[16px] w-[640px]">
            <Messages />
            <MessageInput />
            <CommandSuggestions />
        </div>
    );
}
