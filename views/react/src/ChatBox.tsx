import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommandSuggestions } from './components/CommandSuggestions';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';
import useAltEvent from './hooks/alt-event.hook';
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

    /**
     * Updates the window's options.
     * @param options The new options.
     */
    function updateOptions(options: Options) {
        dispatch(setOptions(options));
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Events -------------------------------------------------------

    useAltEvent('vchat:focus', toggleFocus);
    useAltEvent('vchat:syncSettings', syncSettings);
    useAltEvent('vchat:updateOptions', updateOptions);

    useEffect(() => window?.alt.emit('vchat:requestSettings'), []);

    return (
        <div className="fixed top-[16px] left-[16px] w-[640px]">
            <Messages />
            <MessageInput />
            <CommandSuggestions />
        </div>
    );
}
