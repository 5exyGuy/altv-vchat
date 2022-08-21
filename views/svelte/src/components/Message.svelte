<script lang="ts">
    import { MessageType } from '../enums';
    import ErrorIcon from './icons/ErrorIcon.svelte';
    import InfoIcon from './icons/InfoIcon.svelte';
    import SuccessIcon from './icons/SuccessIcon.svelte';
    import WarningIcon from './icons/WarningIcon.svelte';

    export let type: MessageType = MessageType.Default;
</script>

<div
    class="flex flex-row items-center gap-[8px] text-white text-base select-none fade-in px-[8px]"
    class:py-[4px]={type !== MessageType.Default}
    class:info={type === MessageType.Info}
    class:success={type === MessageType.Success}
    class:warning={type === MessageType.Warning}
    class:error={type === MessageType.Error}
>
    {#if type === MessageType.Info}
        <InfoIcon />
    {/if}
    {#if type === MessageType.Success}
        <SuccessIcon />
    {/if}
    {#if type === MessageType.Warning}
        <WarningIcon />
    {/if}
    {#if type === MessageType.Error}
        <ErrorIcon />
    {/if}
    <div>
        <slot />
    </div>
</div>

<style lang="scss">
    .info {
        background-color: hsla(198, 93%, 60%, 0.6);
        color: hsl(200, 100%, 5%);
    }

    .success {
        background-color: hsla(158, 64%, 52%, 0.6);
        color: hsl(160, 100%, 5%);
    }

    .warning {
        background-color: hsla(43, 100%, 46%, 0.6);
        color: hsl(50, 100%, 5%);
    }

    .error {
        background-color: hsla(0, 100%, 58%, 0.6);
        color: hsl(0, 100%, 5%);
    }

    .fade-in {
        animation: fade-in 500ms;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
