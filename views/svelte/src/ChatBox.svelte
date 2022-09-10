<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import CommandSuggestions from './components/CommandSuggestions.svelte';
    import MessageInput from './components/MessageInput.svelte';
    import Messages from './components/Messages.svelte';
    import type { CommandSuggestion, Options } from './interfaces';
    import { useChatStore } from './stores';

    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { setFocus, commandSuggestions, setCommandSuggestions, setOptions } = useChatStore();

    // --------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------

    // Focus --------------------------------------------------------

    /**
     * Toggle focus on the chat box.
     * @param focus Whether the chat box is focused.
     */
    function toggleFocus(focus: boolean) {
        setFocus(focus);
    }

    /**
     * Syncs the client settings with the server settings.
     * @param settings The chat window's settings.
     */
    function syncSettings(settings: Options, _commandSuggestions: Array<CommandSuggestion>) {
        setOptions(settings);
        setCommandSuggestions([...$commandSuggestions, ..._commandSuggestions]);
        window?.alt?.emit('vchat:mounted');
    }

    /**
     * Updates the window's options.
     * @param options The new options.
     */
    function updateOptions(options: Options) {
        setOptions(options);
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.on('vchat:syncSettings', syncSettings);
        window?.alt?.on('vchat:updateOptions', updateOptions);
        window?.alt?.emit('vchat:requestSettings');
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
        window?.alt?.off('vchat:syncSettings', syncSettings);
        window?.alt?.off('vchat:updateOptions', updateOptions);
    });
</script>

<div class="fixed top-[16px] left-[16px] w-[640px]">
    <Messages />
    <MessageInput />
    <CommandSuggestions />
</div>
