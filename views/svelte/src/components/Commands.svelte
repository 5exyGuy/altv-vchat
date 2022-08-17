<script lang="ts">
    import type { MatchedCommand } from '../interfaces/matched-command.interface';
    import type { Command } from '../interfaces/command.interface';
    import commandsJson from '../commands.json';

    export let commands: Array<Command> = commandsJson; // commands
    export let message: string = ''; // message
    export let prefix: string = '/'; // prefix for commands
    export let max = 3; // max number of commands to display

    let selected = -1; // -1 means no command is selected
    let matchedCommands: Array<MatchedCommand> = [];

    function addPrefix(message: string): string {
        return prefix + message;
    }

    function selectCommand(event: KeyboardEvent) {
        // Only allow arrow keys and tab
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Tab') return;

        // Select previous command
        if (event.key === 'ArrowUp' && matchedCommands.length > 1) selected = Math.max(0, selected - 1);
        // Select next command
        else if (event.key === 'ArrowDown' && matchedCommands.length > 1)
            selected = Math.min(matchedCommands.length - 1, selected + 1);
        // Select the selected command to the chat box input
        else if (event.key === 'Tab' && selected >= 0 && !(matchedCommands[selected].currentParam > -1))
            message = addPrefix(matchedCommands[selected].name);

        event.preventDefault();
    }

    function updateMatchedCommands(message: string) {
        const words = message.split(' ');
        matchedCommands = commands
            .filter((command) => {
                const cmdName = words[0]; // Takes the first word as the command name
                return (
                    addPrefix(command.name).startsWith(cmdName) && words.length - 1 <= (command.parameters.length ?? 0)
                );
            }) // Filter commands that match the message
            .splice(0, max) // Only show the first 3 commands
            .map((command) => {
                let currentParam = -1; // The current parameter we are looking at
                const cmdName = addPrefix(command.name); // The command name with the prefix
                // If there is only one word, it's the command name
                if (words.length === 1 && words[0] === cmdName) currentParam = 0;
                // If there are more words, check if they are parameters
                if (words.length > 1 && words.length - 1 <= (command.parameters.length ?? 0))
                    currentParam = words.length - 1; // The last word is the current parameter

                return { currentParam, ...command };
            }); // Map the commands to include the current parameter
        matchedCommands.length === 0 ? (selected = -1) : (selected = 0); // Reset selected if no commands are found
    }

    $: updateMatchedCommands(message);
</script>

<div
    class="mt-1 text-white flex flex-col transition origin-top"
    class:scale-y-100={message.length > 0}
    class:scale-y-0={message.length === 0}
>
    {#each matchedCommands as matchedCommand, cmdIndex}
        <div
            class="bg-black px-4 py-2 transition duration-200 select-none"
            class:bg-opacity-50={cmdIndex === selected}
            class:bg-opacity-30={cmdIndex !== selected}
            class:hover:bg-opacity-50={cmdIndex !== selected}
            on:click={() => (message = matchedCommand.name)}
        >
            <div class="flex text-base text-white text-opacity-100">
                <span>
                    {prefix}
                </span>
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
                {matchedCommand.currentParam <= 0
                    ? matchedCommand.description
                    : matchedCommand.parameters[matchedCommand.currentParam - 1].description}
            </div>
        </div>
    {/each}
</div>

<svelte:window on:keydown={selectCommand} />
