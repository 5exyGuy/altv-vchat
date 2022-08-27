import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/chat.store';
import type { CommandSuggestion, MatchedCommand } from '../interfaces';
import { setMessage } from '../reducers/chat.reducer';
import classnames from 'classnames';
import commandsJson from '../commands.json';

export function CommandSuggestions() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const focus = useSelector((state: RootState) => state.chat.focus);
    const message = useSelector((state: RootState) => state.chat.message);
    const options = useSelector((state: RootState) => state.chat.options);
    const dispatch = useDispatch();

    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

    const [commands, setCommands] = useState<Array<CommandSuggestion>>(commandsJson);
    const [matchedCommands, setMatchedCommands] = useState<Array<MatchedCommand>>([]);
    const [selected, setSelected] = useState(-1);
    const [key, setKey] = useState('');

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    /**
     * Selects the command suggestion depending on the key pressed.
     * @param event The keyboard event.
     */
    function selectCommand(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Tab') return;
        event.preventDefault();
        setKey(event.key);
    }

    // Command suggestion matching ----------------------------------

    /**
     * Matches the current message against the available command suggestions.
     * @param message The message to match against.
     */
    function updateMatchedCommands(message: string) {
        if (!message) {
            setMatchedCommands([]);
            return;
        }

        const words = message.split(' ');
        if (!words[0].startsWith(options.cmdPrefix)) {
            setMatchedCommands([]);
            return;
        }

        const newMatchedCommands = commands
            .filter((command) => {
                const cmdName = words[0].startsWith(options.cmdPrefix) ? words[0].substring(1) : words[0];

                return (
                    cmdName.length > 0 &&
                    command.name.startsWith(cmdName) &&
                    words.length - 1 <= (command.params?.length ?? 0)
                );
            })
            .splice(0, options.maxCmdSuggestions)
            .map((command) => {
                let currentParam = -1;
                const cmdName = options.cmdPrefix + command.name;

                if (words.length === 1 && words[0] === cmdName) currentParam = 0;
                if (words.length > 1 && words.length - 1 <= (command?.params?.length ?? 0))
                    currentParam = words.length - 1;

                return { currentParam, ...command };
            });
        setMatchedCommands(newMatchedCommands);
        newMatchedCommands.length === 0 ? setSelected(-1) : setSelected(0);
    }

    // Adding the command suggestion --------------------------------

    /**
     * Adds the command suggestion sent by the server.
     * @param suggestion The command suggestion to add.
     */
    function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        Array.isArray(suggestion)
            ? setCommands((commands) => [...commands, ...suggestion])
            : setCommands((commands) => [...commands, suggestion]);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens for message changes and updates the matched commands.
    useEffect(() => updateMatchedCommands(message), [message, commands]);

    // Listens for key changes and updates the selected command.
    useEffect(() => {
        if (!key) return;

        if (key === 'ArrowUp' && matchedCommands.length > 1) setSelected(Math.max(0, selected - 1));
        else if (key === 'ArrowDown' && matchedCommands.length > 1)
            setSelected(Math.min(matchedCommands.length - 1, selected + 1));
        else if (key === 'Tab' && selected >= 0 && !(matchedCommands[selected].currentParam > -1))
            dispatch(setMessage(matchedCommands[selected].name));

        setKey('');
    }, [key]);

    // Mount --------------------------------------------------------

    useEffect(() => {
        window.addEventListener('keydown', selectCommand);
        window?.alt?.on('vchat:addSuggestion', addSuggestion);

        // Unmount --------------------------------------------------

        return () => {
            window.removeEventListener('keydown', selectCommand);
            window?.alt?.off('vchat:addSuggestion', addSuggestion);
        };
    }, []);

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            className={classnames('mt-[4px] text-white flex flex-col transition origin-top', {
                'scale-y-0': !focus || matchedCommands.length === 0,
                'scale-y-100': focus && matchedCommands.length > 0,
            })}
        >
            {matchedCommands.map((matchedCommand, cmdIndex) => (
                <div
                    key={cmdIndex}
                    className={classnames('bg-black px-[16px] py-[8px] transition duration-200 select-none', {
                        'bg-opacity-50': cmdIndex === selected,
                        'bg-opacity-30': cmdIndex !== selected,
                        'hover:bg-opacity-50': cmdIndex !== selected,
                    })}
                >
                    <div className="flex text-base text-white text-opacity-100">
                        <span>{options.cmdPrefix}</span>
                        <span className={classnames({ 'font-bold': matchedCommand.currentParam === 0 })}>
                            {matchedCommand.name}
                        </span>
                        {(matchedCommand.params ?? []).map((param, paramIndex) => (
                            <span
                                key={paramIndex}
                                className={classnames('ml-1', {
                                    'font-bold': matchedCommand.currentParam === paramIndex + 1,
                                })}
                            >
                                [{param.name}]
                            </span>
                        ))}
                    </div>
                    <div className="text-xs text-white text-opacity-50">
                        {(matchedCommand.currentParam <= 0
                            ? matchedCommand.description
                            : matchedCommand.params![matchedCommand.currentParam - 1].description) ?? ''}
                    </div>
                </div>
            ))}
        </div>
    );
}
