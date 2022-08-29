<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import CommandSuggestions from './components/CommandSuggestions.svelte';
    import MessageInput from './components/MessageInput.svelte';
    import Messages from './components/Messages.svelte';
    import { useChatStore } from './stores';

    // --------------------------------------------------------------
    // Chat Store
    // --------------------------------------------------------------

    const { setFocus } = useChatStore();

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

    // --------------------------------------------------------------
    // Hooks
    // --------------------------------------------------------------

    // Mount --------------------------------------------------------

    onMount(() => {
        window?.alt?.on('vchat:focus', toggleFocus);
        // window?.alt?.on('vchat:loadSettings', loadSettings);
        window?.alt?.emit('vchat:mounted');
    });

    // Unmount ------------------------------------------------------

    onDestroy(() => {
        window?.alt?.off('vchat:focus', toggleFocus);
        // window?.alt?.off('vchat:loadSettings', loadSettings);
    });
</script>

<div class="fixed top-[16px] left-[16px] w-[640px]">
    <Messages />
    <MessageInput />
    <CommandSuggestions />
</div>
