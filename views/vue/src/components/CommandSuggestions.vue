<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import type { CommandSuggestion, MatchedCommand } from '../interfaces';
import { useChatStore } from '../stores';

// --------------------------------------------------------------
// Chat Store
// --------------------------------------------------------------

const { focus, message, setMessage, commandSuggestions, setCommandSuggestions, options } = useChatStore();

// --------------------------------------------------------------
// Local Variables
// --------------------------------------------------------------

const matchedCommands: Ref<Array<MatchedCommand>> = ref([]);
const selected: Ref<number> = ref(-1);

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
    if (matchedCommands.value.length === 0) return;

    if (event.key === 'ArrowUp' && matchedCommands.value.length > 1) selected.value = Math.max(0, selected.value - 1);
    else if (event.key === 'ArrowDown' && matchedCommands.value.length > 1)
        selected.value = Math.min(matchedCommands.value.length - 1, selected.value + 1);
    else if (event.key === 'Tab' && selected.value >= 0 && !(matchedCommands.value[selected.value].currentParam > -1))
        setMessage(matchedCommands.value[selected.value].name);

    event.preventDefault();
}

/**
 * Matches the current message against the available command suggestions.
 * @param message The message to match against.
 */
function updateMatchedCommands(message: string, commands: Array<CommandSuggestion>) {
    if (!message) {
        matchedCommands.value = [];
        return;
    }

    const words = message.trim().split(' ');
    const cmdName = words[0].startsWith(options.prefix) ? words[0].substring(1) : '';

    if (cmdName.length === 0) {
        matchedCommands.value = [];
        return;
    }

    const cmdParams = words.slice(1);

    matchedCommands.value = commands
        .filter(
            (command) =>
                (command.name === cmdName && cmdParams.length <= (command.params?.length ?? 0)) ||
                (command.name.startsWith(cmdName) && cmdParams.length === 0),
        )
        .splice(0, options.maxCommandSuggestions)
        .map((command) => {
            let currentParam = -1;

            if (words.length === 1 && command.name === cmdName) currentParam = 0;
            else if (cmdParams.length > 0 && cmdParams.length <= (command.params?.length ?? 0))
                currentParam = cmdParams.length;

            return { currentParam, ...command, name: options.prefix + command.name };
        });
    matchedCommands.value.length === 0 ? (selected.value = -1) : (selected.value = 0);
}

// Adding the command suggestion --------------------------------

/**
 * Adds the command suggestion sent by the server.
 * @param suggestion The command suggestion to add.
 */
function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    Array.isArray(suggestion)
        ? setCommandSuggestions([...commandSuggestions.value, ...suggestion])
        : setCommandSuggestions([...commandSuggestions.value, suggestion]);
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
watch([message, commandSuggestions, options], ([message, commands]) => updateMatchedCommands(message, commands));

// Mount --------------------------------------------------------

onMounted(() => {
    window.addEventListener('keydown', selectCommand);
    window?.alt?.on('vchat:addSuggestion', addSuggestion);
    window?.alt?.on('vchat:removeSuggestions', removeSuggestions);
});

// Unmount ------------------------------------------------------

onUnmounted(() => {
    window.removeEventListener('keydown', selectCommand);
    window?.alt?.off('vchat:addSuggestion', addSuggestion);
    window?.alt?.off('vchat:removeSuggestions', removeSuggestions);
});
</script>

<template>
    <div
        class="mt-[4px] text-white flex flex-col transition origin-top scale-y-0"
        :class="{
            'scale-y-100': matchedCommands.length > 0 && focus,
        }"
    >
        <div
            v-for="(matchedCommand, cmdIndex) in matchedCommands"
            class="bg-black px-[16px] py-[8px] transition duration-200 select-none"
            :class="{
                'bg-opacity-50': cmdIndex === selected,
                'bg-opacity-30': cmdIndex !== selected,
                'hover:bg-opacity-50': cmdIndex !== selected,
            }"
        >
            <div class="flex text-base text-white text-opacity-100">
                <span :class="{ 'font-bold': matchedCommand.currentParam === 0 }">{{ matchedCommand.name }}</span>
                <span
                    v-for="(param, paramIndex) in matchedCommand.params"
                    class="ml-1"
                    :class="{ 'font-bold': matchedCommand.currentParam === paramIndex + 1 }"
                >
                    [{{ param.name }}]
                </span>
            </div>
            <div class="text-xs text-white text-opacity-50">
                {{
                    (matchedCommand.currentParam <= 0
                        ? matchedCommand.description
                        : matchedCommand.params![matchedCommand.currentParam - 1].description) ?? ''
                }}
            </div>
        </div>
    </div>
</template>
