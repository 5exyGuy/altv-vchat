import type { CommandSuggestion, MatchedCommand } from '../interfaces';
import { createEffect, createSignal, For, on, onCleanup, onMount } from 'solid-js';
import { chatStore } from '../stores';
import commandsJson from '../commands.json';

export function Commands() {
    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, message, setMessage, options } = chatStore;

    // --------------------------------------------------------------
    // States
    // --------------------------------------------------------------

    const [commands, setCommands] = createSignal(commandsJson as Array<CommandSuggestion>);
    const [matchedCommands, setMatchedCommands] = createSignal([] as Array<MatchedCommand>);
    const [selected, setSelected] = createSignal(-1);

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    function addPrefix(message: string): string {
        return options.prefix + message;
    }

    function removePrefix(message: string): string {
        return message.startsWith(options.prefix) ? message.substring(1) : message;
    }

    function selectCommand(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Tab') return;
        if (matchedCommands().length === 0) return;

        // Select previous command
        if (event.key === 'ArrowUp' && matchedCommands().length > 1) {
            setSelected((selected) => Math.max(0, selected - 1));
        }
        // Select next command
        else if (event.key === 'ArrowDown' && matchedCommands().length > 1) {
            setSelected((selected) => Math.min(matchedCommands().length - 1, selected + 1));
        }
        // Select the selected command to the chat box input
        else if (event.key === 'Tab' && selected() >= 0 && !(matchedCommands()[selected()].currentParam > -1))
            setMessage(addPrefix(matchedCommands()[selected()].name));

        event.preventDefault();
    }

    function updateMatchedCommands(message: string) {
        if (!message) {
            setMatchedCommands([]);
            return;
        }

        const words = message.split(' ');
        if (!words[0].startsWith(options.prefix)) {
            setMatchedCommands([]);
            return;
        }

        setMatchedCommands(
            commands()
                .filter((command) => {
                    const cmdName = removePrefix(words[0]);

                    return (
                        cmdName.length > 0 &&
                        command.name.startsWith(cmdName) &&
                        words.length - 1 <= (command.params?.length ?? 0)
                    );
                }) // Filter commands that match the message
                .splice(0, options.maxSuggestions) // Only show the first 3 commands
                .map((command) => {
                    let currentParam = -1; // The current parameter we are looking at
                    const cmdName = addPrefix(command.name); // The command name with the prefix
                    // If there is only one word, it's the command name
                    if (words.length === 1 && words[0] === cmdName) currentParam = 0;

                    // If there are more words, check if they are parameters
                    if (words.length > 1 && words.length - 1 <= (command?.params?.length ?? 0))
                        currentParam = words.length - 1; // The last word is the current parameter

                    return { currentParam, ...command };
                }), // Map the commands to include the current parameter
        );
        matchedCommands().length === 0 ? setSelected(-1) : setSelected(0); // Reset selected if no commands are found
    }

    function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        Array.isArray(suggestion)
            ? setCommands((commands) => [...commands, ...suggestion])
            : setCommands((commands) => [...commands, suggestion]);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    onMount(() => {
        window.addEventListener('keydown', selectCommand);
        window?.alt?.on('vchat:addSuggestion', addSuggestion);
    });

    onCleanup(() => {
        window.removeEventListener('keydown', selectCommand);
        window?.alt?.off('vchat:addSuggestion', addSuggestion);
    });

    createEffect(on(message, (message) => updateMatchedCommands(message)));

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
                            <span>{options.prefix}</span>
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
