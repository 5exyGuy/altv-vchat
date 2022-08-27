import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CommandSuggestions } from './components/CommandSuggestions';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';
import { setFocus } from './reducers/chat.reducer';

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

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------

    useEffect(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        // window?.alt?.on('vchat:loadSettings', loadSettings);
        window?.alt?.emit('vchat:mounted');

        // Unmount --------------------------------------------------

        return () => {
            window?.alt?.off('vchat:focus', toggleFocus);
            // window?.alt?.off('vchat:loadSettings', loadSettings);
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
