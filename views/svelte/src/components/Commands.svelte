<script lang="ts">
    import type { MatchedCommand } from '../interfaces/matched-command.interface';
    import type { Command } from '../interfaces/command.interface';

    export let commands: Array<Command> = [
        { name: '/help', description: 'Show this help' },
        {
            name: '/ban',
            description: 'Ban a player',
            parameters: [
                { name: 'player', description: "Player's name" },
                { name: 'reason', description: 'Reason' },
            ],
        },
        {
            name: '/heal',
            description: 'Heal a player',
            parameters: [{ name: 'player', description: "Player's name" }],
        },
    ];
    export let selected = -1;
    export let message: string = '';

    let matchedCommands: Array<MatchedCommand> = [];

    function selectCommand(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Tab') return;

        if (event.key === 'ArrowUp' && matchedCommands.length > 1) selected = Math.max(0, selected - 1);
        else if (event.key === 'ArrowDown' && matchedCommands.length > 1)
            selected = Math.min(matchedCommands.length - 1, selected + 1);
        else if (event.key === 'Tab' && selected >= 0) {
            const command = matchedCommands[selected];
            message = command.name;
        }

        event.preventDefault();
    }

    function updateMatchedCommands(message: string) {
        matchedCommands = commands
            .filter((command) => message.length > 0 && command.name.startsWith(message.split(' ')[0]))
            .splice(0, 3)
            .map((command) => {
                command.parameters = command.parameters ?? [];
                let currentParam = -1;
                const params = message.split(' ');

                if (params.length === 1 && params[0] === command.name) currentParam = 0;
                else if (params.length > 1 && params.length - 1 === command.parameters.length)
                    currentParam = params.length - 1;

                return { currentParam, ...command };
            });

        matchedCommands.length === 0 ? (selected = -1) : (selected = 0);
    }

    $: updateMatchedCommands(message);
</script>

<div class={`mt-1 text-white flex flex-col transition origin-top ${message.length > 0 ? 'scale-y-100' : 'scale-y-0'}`}>
    {#each matchedCommands as matchedCommand, cmdIndex}
        <div
            class={`bg-black px-4 py-2 transition duration-200 select-none`}
            class:bg-opacity-50={cmdIndex === selected}
            class:bg-opacity-30={cmdIndex !== selected}
            class:hover:bg-opacity-50={cmdIndex !== selected}
            on:click={() => (message = matchedCommand.name)}
        >
            <div class="text-base text-white text-opacity-100">
                <div class="inline-block" class:font-bold={matchedCommand.currentParam === 0}>
                    {matchedCommand.name}
                </div>
                {#each matchedCommand.parameters ?? [] as param, paramIndex}
                    <div class="inline-block" class:font-bold={matchedCommand.currentParam === paramIndex + 1}>
                        <!-- Parameter name -->
                        [{param.name}]&nbsp;
                    </div>
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
