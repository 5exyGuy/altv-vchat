import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/chat.store';
import type { CommandSuggestion, MatchedCommand } from '../interfaces';
import { addCommandSuggestion, removeCommandSuggestions, setMessage } from '../reducers/chat.reducer';
import classnames from 'classnames';
import useWindowEvent from '../hooks/window-event.hook';
import useAltEvent from '../hooks/alt-event.hook';

export function CommandSuggestions() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const focus = useSelector((state: RootState) => state.chat.focus);
    const message = useSelector((state: RootState) => state.chat.message);
    const options = useSelector((state: RootState) => state.chat.options);
    const commands = useSelector((state: RootState) => state.chat.commandSuggestions);
    const dispatch = useDispatch();

    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

    const [matchedCommands, setMatchedCommands] = useState<Array<MatchedCommand>>([]);
    const [selected, setSelected] = useState(-1);

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    /**
     * Selects the command suggestion depending on the key pressed.
     * @param event The keyboard event.
     */
    function selectCommand(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Tab') return;

        if (event.key === 'ArrowUp' && matchedCommands.length > 1) setSelected(Math.max(0, selected - 1));
        else if (event.key === 'ArrowDown' && matchedCommands.length > 1)
            setSelected(Math.min(matchedCommands.length - 1, selected + 1));
        else if (event.key === 'Tab' && selected >= 0 && !(matchedCommands[selected].currentParam > -1))
            dispatch(setMessage(matchedCommands[selected].name));

        event.preventDefault();
    }

    // Command suggestion matching ----------------------------------

    /**
     * Matches the current message against the available command suggestions.
     * @param message The message to match against.
     */
    function updateMatchedCommands(message: string, commands: Array<CommandSuggestion>) {
        setSelected(-1);

        if (!message) {
            setMatchedCommands([]);
            return;
        }

        const words = message.trim().split(' ');
        const cmdName = words[0].startsWith(options.prefix) ? words[0].substring(1) : '';

        if (cmdName.length === 0) {
            setMatchedCommands([]);
            return;
        }

        const cmdParams = words.slice(1);

        const newMatchedCommands = commands
            .filter(
                (command) =>
                    (command.name === cmdName && cmdParams.length <= (command.parameters?.length ?? 0)) ||
                    (command.name.startsWith(cmdName) && cmdParams.length === 0),
            )
            .splice(0, options.maxCommandSuggestions)
            .map((command) => {
                let currentParam = -1;

                if (words.length === 1 && command.name === cmdName) currentParam = 0;
                else if (cmdParams.length > 0 && cmdParams.length <= (command.parameters?.length ?? 0))
                    currentParam = cmdParams.length;

                return { currentParam, ...command, name: options.prefix + command.name };
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
        dispatch(addCommandSuggestion(suggestion));
    }

    /**
     * Removes all command suggestions.
     */
    function removeSuggestions() {
        dispatch(removeCommandSuggestions());
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens for message, command suggestions and options changes, and updates the matched commands.
    useEffect(() => updateMatchedCommands(message, commands), [message, commands, options]);

    // Events -------------------------------------------------------

    useWindowEvent('keydown', selectCommand);

    useAltEvent('vchat:addSuggestion', addSuggestion);
    useAltEvent('vchat:removeSuggestions', removeSuggestions);

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            className={classnames('mt-[4px] text-white flex flex-col transition origin-top', {
                'scale-y-100': matchedCommands.length > 0 && focus,
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
                        <span className={classnames({ 'font-bold': matchedCommand.currentParam === 0 })}>
                            {matchedCommand.name}
                        </span>
                        {(matchedCommand.parameters ?? []).map((param, paramIndex) => (
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
                            : matchedCommand.parameters![matchedCommand.currentParam - 1].description) ?? ''}
                    </div>
                </div>
            ))}
        </div>
    );
}
