<script lang="ts">
    import type { CommandSuggestion, MatchedCommand } from '../interfaces';
    import commandsJson from '../commands.json';
    import { onDestroy, onMount } from 'svelte';

    // --------------------------------------------------------------
    // Props
    // --------------------------------------------------------------

    export let commands: Array<CommandSuggestion> = commandsJson; // commands
    export let message: string = ''; // message
    export let prefix: string = '/'; // prefix for commands
    export let max = 3; // max number of commands to display

    // --------------------------------------------------------------
    // Variables
    // --------------------------------------------------------------

    let selected = -1; // -1 means no command is selected
    let matchedCommands: Array<MatchedCommand> = [];
    let focus: boolean = false;

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    function addPrefix(message: string): string {
        return prefix + message;
    }

    function removePrefix(message: string): string {
        return message.startsWith(prefix) ? message.substring(1) : message;
    }

    function selectCommand(event: KeyboardEvent) {
        // Select previous command
        if (event.key === 'ArrowUp' && matchedCommands.length > 1) {
            event.preventDefault();
            selected = Math.max(0, selected - 1);
        }
        // Select next command
        else if (event.key === 'ArrowDown' && matchedCommands.length > 1) {
            event.preventDefault();
            selected = Math.min(matchedCommands.length - 1, selected + 1);
        }
        // Select the selected command to the chat box input
        else if (event.key === 'Tab' && selected >= 0 && !(matchedCommands[selected].currentParam > -1)) {
            event.preventDefault();
            message = addPrefix(matchedCommands[selected].name);
        }
    }

    function updateMatchedCommands(message: string) {
        if (!message) {
            matchedCommands = [];
            return;
        }

        const words = message.split(' ');
        if (!words[0].startsWith(prefix)) {
            matchedCommands = [];
            return;
        }

        matchedCommands = commands
            .filter((command) => {
                const cmdName = removePrefix(words[0]);

                return (
                    cmdName.length > 0 &&
                    command.name.startsWith(cmdName) &&
                    words.length - 1 <= (command.params?.length ?? 0)
                );
            }) // Filter commands that match the message
            .splice(0, max) // Only show the first 3 commands
            .map((command) => {
                let currentParam = -1; // The current parameter we are looking at
                const cmdName = addPrefix(command.name); // The command name with the prefix
                // If there is only one word, it's the command name
                if (words.length === 1 && words[0] === cmdName) currentParam = 0;

                // If there are more words, check if they are parameters
                if (words.length > 1 && words.length - 1 <= (command.params.length ?? 0))
                    currentParam = words.length - 1; // The last word is the current parameter

                return { currentParam, ...command };
            }); // Map the commands to include the current parameter
        matchedCommands.length === 0 ? (selected = -1) : (selected = 0); // Reset selected if no commands are found
    }

    function toggleFocus(_focus: boolean) {
        focus = _focus;
    }

    function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        Array.isArray(suggestion) ? (commands = [...commands, ...suggestion]) : (commands = [...commands, suggestion]);
        updateMatchedCommands(message);
    }

    // --------------------------------------------------------------
    // Reactive Statments
    // --------------------------------------------------------------

    $: updateMatchedCommands(message);

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.on('vchat:addSuggestion', addSuggestion);
    });

    onDestroy(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
        window?.alt?.off('vchat:addSuggestion', addSuggestion);
    });
</script>

<div
    class="mt-[4px] text-white flex flex-col transition origin-top scale-y-0"
    class:!scale-y-100={matchedCommands.length > 0 && focus}
>
    {#each matchedCommands as matchedCommand, cmdIndex}
        <div
            class="bg-black px-[16px] py-[8px] transition duration-200 select-none"
            class:bg-opacity-50={cmdIndex === selected}
            class:bg-opacity-30={cmdIndex !== selected}
            class:hover:bg-opacity-50={cmdIndex !== selected}
        >
            <div class="flex text-base text-white text-opacity-100">
                <span>
                    {prefix}
                </span>
                <span class:font-bold={matchedCommand.currentParam === 0}>
                    {matchedCommand.name}
                </span>
                {#each matchedCommand.params ?? [] as param, paramIndex}
                    <span class="ml-1" class:font-bold={matchedCommand.currentParam === paramIndex + 1}>
                        [{param.name}]
                    </span>
                {/each}
            </div>
            <div class="text-xs text-white text-opacity-50">
                {(matchedCommand.currentParam <= 0
                    ? matchedCommand.description
                    : matchedCommand.params[matchedCommand.currentParam - 1].description) ?? ''}
            </div>
        </div>
    {/each}
</div>

<svelte:window on:keydown={selectCommand} />
