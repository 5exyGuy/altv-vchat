<script lang="ts">
    import type { CommandSuggestion, MatchedCommand } from '../interfaces';
    import { onDestroy, onMount } from 'svelte';
    import { useChatStore } from '../stores';

    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, message, setMessage, commandSuggestions, setCommandSuggestions, options } = useChatStore();

    // --------------------------------------------------------------
    // Local Variables
    // --------------------------------------------------------------

    let matchedCommands: Array<MatchedCommand> = [];
    let selected: number = -1;

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
        if (matchedCommands.length === 0) return;

        if (event.key === 'ArrowUp' && matchedCommands.length > 1) selected = Math.max(0, selected - 1);
        else if (event.key === 'ArrowDown' && matchedCommands.length > 1)
            selected = Math.min(matchedCommands.length - 1, selected + 1);
        else if (event.key === 'Tab' && selected >= 0 && !(matchedCommands[selected].currentParam > -1))
            setMessage(matchedCommands[selected].name);

        event.preventDefault();
    }

    /**
     * Matches the current message against the available command suggestions.
     * @param message The message to match against.
     */
    function updateMatchedCommands(message: string, commands: Array<CommandSuggestion>) {
        if (!message) {
            matchedCommands = [];
            return;
        }

        const words = message.trim().split(' ');
        const cmdName = words[0].startsWith($options.prefix) ? words[0].substring(1) : '';

        if (cmdName.length === 0) {
            matchedCommands = [];
            return;
        }

        const cmdParams = words.slice(1);

        matchedCommands = commands
            .filter(
                (command) =>
                    (command.name === cmdName && cmdParams.length <= (command.parameters?.length ?? 0)) ||
                    (command.name.startsWith(cmdName) && cmdParams.length === 0),
            )
            .splice(0, $options.maxCommandSuggestions)
            .map((command) => {
                let currentParam = -1;

                if (words.length === 1 && command.name === cmdName) currentParam = 0;
                else if (cmdParams.length > 0 && cmdParams.length <= (command.parameters?.length ?? 0))
                    currentParam = cmdParams.length;

                return { currentParam, ...command, name: $options.prefix + command.name };
            });
        matchedCommands.length === 0 ? (selected = -1) : (selected = 0);
    }

    // Adding the command suggestion --------------------------------

    /**
     * Adds the command suggestion sent by the server.
     * @param suggestion The command suggestion to add.
     */
    function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        Array.isArray(suggestion)
            ? setCommandSuggestions([...$commandSuggestions, ...suggestion])
            : setCommandSuggestions([...$commandSuggestions, suggestion]);
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
    $: updateMatchedCommands($message, $commandSuggestions);
    const unsubOptions = options.subscribe(() => updateMatchedCommands($message, $commandSuggestions));

    // Mount --------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:addSuggestion', addSuggestion);
        window?.alt?.on('vchat:removeSuggestions', removeSuggestions);
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => {
        unsubOptions();

        window?.alt?.off('vchat:addSuggestion', addSuggestion);
        window?.alt?.off('vchat:removeSuggestions', removeSuggestions);
    });
</script>

<div
    class="mt-[4px] text-white flex flex-col transition origin-top scale-y-0"
    class:!scale-y-100={matchedCommands.length > 0 && $focus}
>
    {#each matchedCommands as matchedCommand, cmdIndex}
        <div
            class="bg-black px-[16px] py-[8px] transition duration-200 select-none"
            class:bg-opacity-50={cmdIndex === selected}
            class:bg-opacity-30={cmdIndex !== selected}
            class:hover:bg-opacity-50={cmdIndex !== selected}
        >
            <div class="flex text-base text-white text-opacity-100">
                <span class:font-bold={matchedCommand.currentParam === 0}>
                    {matchedCommand.name}
                </span>
                {#each matchedCommand.parameters ?? [] as param, paramIndex}
                    <span class="ml-1" class:font-bold={matchedCommand.currentParam === paramIndex + 1}>
                        [{param.name}]
                    </span>
                {/each}
            </div>
            <div class="text-xs text-white text-opacity-50">
                {(matchedCommand.currentParam <= 0
                    ? matchedCommand.description
                    : matchedCommand.parameters[matchedCommand.currentParam - 1].description) ?? ''}
            </div>
        </div>
    {/each}
</div>

<svelte:window on:keydown={selectCommand} />
