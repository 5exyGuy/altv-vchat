import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommandSuggestions } from './components/CommandSuggestions';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';
import type { CommandSuggestion, Options } from './interfaces';
import { addCommandSuggestion, setFocus, setOptions } from './reducers/chat.reducer';

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
    function syncSettings(settings: Options, commandSuggestions: Array<CommandSuggestion>) {
        dispatch(setOptions(settings));
        dispatch(addCommandSuggestion(commandSuggestions));
        window?.alt?.emit('vchat:mounted');
    }

    function updateOptions(options: Options) {
        dispatch(setOptions(options));
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------

    useEffect(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.on('vchat:syncSettings', syncSettings);
        window?.alt?.on('vchat:updateOptions', updateOptions);
        window?.alt.emit('vchat:requestSettings');

        // Unmount --------------------------------------------------

        return () => {
            window?.alt?.off('vchat:focus', toggleFocus);
            window?.alt?.off('vchat:syncSettings', syncSettings);
            window?.alt?.off('vchat:updateOptions', updateOptions);
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
