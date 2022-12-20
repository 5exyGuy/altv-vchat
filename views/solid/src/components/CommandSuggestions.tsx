import type { CommandSuggestion, MatchedCommand } from '../interfaces';
import { createEffect, createSignal, For, on, onCleanup, onMount } from 'solid-js';
import { chatStore } from '../stores';

export function CommandSuggestions() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, message, setMessage, commandSuggestions, setCommandSuggestions, options } = chatStore;

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    const [matchedCommands, setMatchedCommands] = createSignal<Array<MatchedCommand>>([]);
    const [selected, setSelected] = createSignal<number>(-1);

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Command suggestion selection ---------------------------------

    /**
     * Selects the command suggestion depending on the key pressed.
     * @param event The keyboard event.
     */
    function selectCommand(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Tab') return;
        if (matchedCommands().length === 0) return;

        if (event.key === 'ArrowUp' && matchedCommands().length > 1)
            setSelected((selected) => Math.max(0, selected - 1));
        else if (event.key === 'ArrowDown' && matchedCommands().length > 1)
            setSelected((selected) => Math.min(matchedCommands().length - 1, selected + 1));
        else if (event.key === 'Tab' && selected() >= 0 && !(matchedCommands()[selected()].currentParam > -1))
            setMessage(matchedCommands()[selected()].name);

        event.preventDefault();
    }

    // Command suggestion matching ----------------------------------

    /**
     * Matches the current message against the available command suggestions.
     * @param message The message to match against.
     */
    function updateMatchedCommands(message: string, commands: Array<CommandSuggestion>) {
        if (!message) {
            setMatchedCommands([]);
            return;
        }

        const words = message.trim().split(' ');
        const cmdName = words[0].startsWith(options().prefix) ? words[0].substring(1) : '';

        if (cmdName.length === 0) {
            setMatchedCommands([]);
            return;
        }

        const cmdParams = words.slice(1);

        setMatchedCommands(
            commands
                .filter(
                    (command) =>
                        (command.name === cmdName && cmdParams.length <= (command.parameters?.length ?? 0)) ||
                        (command.name.startsWith(cmdName) && cmdParams.length === 0),
                )
                .splice(0, options().maxCommandSuggestions)
                .map((command) => {
                    let currentParam = -1;

                    if (words.length === 1 && command.name === cmdName) currentParam = 0;
                    else if (cmdParams.length > 0 && cmdParams.length <= (command.parameters?.length ?? 0))
                        currentParam = cmdParams.length;

                    return { currentParam, ...command, name: options().prefix + command.name };
                }),
        );
        matchedCommands().length === 0 ? setSelected(-1) : setSelected(0);
    }

    // Adding the command suggestion --------------------------------

    /**
     * Adds the command suggestion sent by the server.
     * @param suggestion The command suggestion to add.
     */
    function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        Array.isArray(suggestion)
            ? setCommandSuggestions((commands) => [...commands, ...suggestion])
            : setCommandSuggestions((commands) => [...commands, suggestion]);
    }

    /**
     * Removes all command suggestions.
     */
    function removeSuggestions() {
        setCommandSuggestions([]);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens for message changes and updates the matched commands.
    createEffect(
        on([message, commandSuggestions, options], ([message, commands]) => updateMatchedCommands(message, commands)),
    );

    // Mount --------------------------------------------------------

    onMount(() => {
        window.addEventListener('keydown', selectCommand);
        window?.alt?.on('vchat:addSuggestion', addSuggestion);
        window?.alt?.on('vchat:removeSuggestions', removeSuggestions);
    });

    // Unmount ------------------------------------------------------

    onCleanup(() => {
        window.removeEventListener('keydown', selectCommand);
        window?.alt?.off('vchat:addSuggestion', addSuggestion);
        window?.alt?.on('vchat:removeSuggestions', removeSuggestions);
    });

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            class="mt-[4px] text-white flex flex-col transition origin-top"
            classList={{
                'scale-y-100': matchedCommands().length > 0 && focus(),
            }}
        >
            <For each={matchedCommands()}>
                {(matchedCommand, cmdIndex) => (
                    <div
                        class="bg-black px-[16px] py-[8px] transition duration-200 select-none"
                        classList={{
                            'bg-opacity-50': cmdIndex() === selected(),
                            'bg-opacity-30': cmdIndex() !== selected(),
                            'hover:bg-opacity-50': cmdIndex() !== selected(),
                        }}
                    >
                        <div class="flex text-base text-white text-opacity-100">
                            <span classList={{ 'font-bold': matchedCommand.currentParam === 0 }}>
                                {matchedCommand.name}
                            </span>
                            <For each={matchedCommand.parameters ?? []}>
                                {(param, paramIndex) => (
                                    <span
                                        class="ml-1"
                                        classList={{ 'font-bold': matchedCommand.currentParam === paramIndex() + 1 }}
                                    >
                                        [{param.name}]
                                    </span>
                                )}
                            </For>
                        </div>
                        <div class="text-xs text-white text-opacity-50">
                            {(matchedCommand.currentParam <= 0
                                ? matchedCommand.description
                                : matchedCommand.parameters![matchedCommand.currentParam - 1].description) ?? ''}
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
}
