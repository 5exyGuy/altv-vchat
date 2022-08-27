import type { CommandSuggestion, MatchedCommand } from '../interfaces';
import { createEffect, createSignal, For, on, onCleanup, onMount } from 'solid-js';
import { chatStore } from '../stores';
import commandsJson from '../commands.json';

export function CommandSuggestions() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, message, setMessage, options } = chatStore;

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    const [commands, setCommands] = createSignal<Array<CommandSuggestion>>(commandsJson);
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

        setMatchedCommands(
            commands()
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

                    return { currentParam, ...command, name: cmdName };
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
            ? setCommands((commands) => [...commands, ...suggestion])
            : setCommands((commands) => [...commands, suggestion]);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Effects ------------------------------------------------------

    // Listens for message changes and updates the matched commands.
    createEffect(on(message, (message) => updateMatchedCommands(message)));

    // Mount --------------------------------------------------------

    onMount(() => {
        window.addEventListener('keydown', selectCommand);
        window?.alt?.on('vchat:addSuggestion', addSuggestion);
    });

    // Unmount ------------------------------------------------------

    onCleanup(() => {
        window.removeEventListener('keydown', selectCommand);
        window?.alt?.off('vchat:addSuggestion', addSuggestion);
    });

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------

    return (
        <div
            class="mt-[4px] text-white flex flex-col transition origin-top"
            classList={{
                'scale-y-0': !focus() || matchedCommands().length === 0,
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
                            <span>{options.cmdPrefix}</span>
                            <span classList={{ 'font-bold': matchedCommand.currentParam === 0 }}>
                                {matchedCommand.name}
                            </span>
                            <For each={matchedCommand.params ?? []}>
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
                                : matchedCommand.params![matchedCommand.currentParam - 1].description) ?? ''}
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
}
