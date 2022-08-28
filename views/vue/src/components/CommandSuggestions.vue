<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { CommandSuggestion, MatchedCommand } from '../interfaces';
import { useChatStore } from '../stores';

// --------------------------------------------------------------
// Chat Store
// --------------------------------------------------------------

const { focus, message, setMessage, options } = useChatStore();

// --------------------------------------------------------------
// Local Variables
// --------------------------------------------------------------

const commands = ref([] as Array<CommandSuggestion>);
const matchedCommands = ref([] as Array<MatchedCommand>);
const selected = ref(-1);

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
function updateMatchedCommands(message: string) {
    if (!message) {
        matchedCommands.value = [];
        return;
    }

    const words = message.split(' ');
    if (!words[0].startsWith(options.cmdPrefix)) {
        matchedCommands.value = [];
        return;
    }

    matchedCommands.value = commands.value
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
            if (words.length > 1 && words.length - 1 <= (command?.params?.length ?? 0)) currentParam = words.length - 1;
            return { currentParam, ...command };
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
        ? (commands.value = [...commands.value, ...suggestion])
        : (commands.value = [...commands.value, suggestion]);
}

// --------------------------------------------------------------
// Hooks
// --------------------------------------------------------------

// Effects ------------------------------------------------------

// Listens for message changes and updates the matched commands.
watch([message, commands], ([message]) => updateMatchedCommands(message));

// Mount --------------------------------------------------------

onMounted(() => {
    window.addEventListener('keydown', selectCommand);
    window?.alt?.on('vchat:addSuggestion', addSuggestion);
});

// Unmount ------------------------------------------------------

onUnmounted(() => {
    window.removeEventListener('keydown', selectCommand);
    window?.alt?.off('vchat:addSuggestion', addSuggestion);
});
</script>

<template>
    <div
        class="mt-[4px] text-white flex flex-col transition origin-top scale-y-0"
        :class="{
            'scale-y-0': !focus || matchedCommands.length === 0,
            'scale-y-100': focus && matchedCommands.length > 0,
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
                <span>{{ options.cmdPrefix }}</span>
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
