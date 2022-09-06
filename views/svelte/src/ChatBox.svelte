<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import CommandSuggestions from './components/CommandSuggestions.svelte';
    import MessageInput from './components/MessageInput.svelte';
    import Messages from './components/Messages.svelte';
    import { useChatStore } from './stores';

    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { focus, setFocus, options, setOptions } = useChatStore();

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
    function syncSettings(settings: typeof $options) {
        setOptions(settings);
        window?.alt?.emit('vchat:mounted');
    }

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        window?.alt?.on('vchat:syncSettings', syncSettings);
        window?.alt?.emit('vchat:requestSettings');
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
        window?.alt?.off('vchat:loadSettings', syncSettings);
    });
</script>

<div class="fixed top-[16px] left-[16px] w-[640px]">
    <Messages />
    <MessageInput />
    <CommandSuggestions />
</div>
