<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { CommandSuggestion, MatchedCommand } from '../interfaces';
import { chatStore } from '../stores';

const commands = ref([] as Array<CommandSuggestion>);
const matchedCommands = ref([] as Array<MatchedCommand>);
const selected = ref(-1);

function addPrefix(message: string): string {
    return chatStore.prefix + message;
}

function removePrefix(message: string): string {
    return message.startsWith(chatStore.prefix) ? message.substring(1) : message;
}

function selectCommand(event: KeyboardEvent) {
    // Select previous command
    if (event.key === 'ArrowUp' && matchedCommands.value.length > 1) {
        event.preventDefault();
        selected.value = Math.max(0, selected.value - 1);
    }
    // Select next command
    else if (event.key === 'ArrowDown' && matchedCommands.value.length > 1) {
        event.preventDefault();
        selected.value = Math.min(matchedCommands.value.length - 1, selected.value + 1);
    }
    // Select the selected command to the chat box input
    else if (event.key === 'Tab' && selected.value >= 0 && !(matchedCommands.value[selected.value].currentParam > -1)) {
        event.preventDefault();
        chatStore.message = addPrefix(matchedCommands.value[selected.value].name);
    }
}

function updateMatchedCommands(message: string) {
    if (!message) {
        matchedCommands.value = [];
        return;
    }

    const words = message.split(' ');
    if (!words[0].startsWith(chatStore.prefix)) {
        matchedCommands.value = [];
        return;
    }

    matchedCommands.value = commands.value
        .filter((command) => {
            const cmdName = removePrefix(words[0]);

            return (
                cmdName.length > 0 &&
                command.name.startsWith(cmdName) &&
                words.length - 1 <= (command.params?.length ?? 0)
            );
        }) // Filter commands that match the message
        .splice(0, chatStore.maxSuggestions) // Only show the first 3 commands
        .map((command) => {
            let currentParam = -1; // The current parameter we are looking at
            const cmdName = addPrefix(command.name); // The command name with the prefix
            // If there is only one word, it's the command name
            if (words.length === 1 && words[0] === cmdName) currentParam = 0;

            // If there are more words, check if they are parameters
            if (words.length > 1 && words.length - 1 <= (command?.params?.length ?? 0)) currentParam = words.length - 1; // The last word is the current parameter

            return { currentParam, ...command };
        }); // Map the commands to include the current parameter
    matchedCommands.value.length === 0 ? (selected.value = -1) : (selected.value = 0); // Reset selected if no commands are found
}

function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    Array.isArray(suggestion)
        ? (commands.value = [...commands.value, ...suggestion])
        : (commands.value = [...commands.value, suggestion]);
    updateMatchedCommands(chatStore.message);
}

watch(chatStore, (_, newValue) => updateMatchedCommands(newValue.message));

onMounted(() => {
    window.addEventListener('keydown', selectCommand);
    window?.alt?.on('vchat:addSuggestion', addSuggestion);
});

onUnmounted(() => {
    window.removeEventListener('keydown', selectCommand);
    window?.alt?.off('vchat:addSuggestion', addSuggestion);
});
</script>

<template>
    <div
        class="mt-[4px] text-white flex flex-col transition origin-top scale-y-0"
        :class="{
            'scale-y-0': !chatStore.focus || matchedCommands.length === 0,
            'scale-y-100': chatStore.focus && matchedCommands.length > 0,
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
                <span>{{ chatStore.prefix }}</span>
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
                        : matchedCommand!.params![matchedCommand.currentParam - 1].description) ?? ''
                }}
            </div>
        </div>
    </div>
</template>
