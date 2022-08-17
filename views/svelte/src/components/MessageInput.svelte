<script lang="ts">
    export let placeholder: string = 'Type a message...';
    export let message: string = '';
    export let messages: Array<string> = [];

    async function sendMessage(event: KeyboardEvent) {
        if (event.key !== 'Enter') return;
        if (!message || typeof message !== 'string' || message.length === 0) return;

        messages = [...messages, message];
        message = '';

        event.preventDefault();
    }
</script>

<input
    class="bg-black bg-opacity-50 text-base text-white px-4 py-2 focus:outline-none"
    {placeholder}
    bind:value={message}
    on:keydown={sendMessage}
    on:input
/>
