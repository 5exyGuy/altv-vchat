<script lang="ts">
    import { MessageType } from '../enums';
    import ErrorIcon from './icons/ErrorIcon.svelte';
    import InfoIcon from './icons/InfoIcon.svelte';
    import SuccessIcon from './icons/SuccessIcon.svelte';
    import WarningIcon from './icons/WarningIcon.svelte';

    export let type: MessageType = MessageType.Default;
</script>

<div
    class="flex flex-row items-center gap-[8px] text-white text-base select-none fade-in"
    class:py-[4px]={type !== MessageType.Default && type !== MessageType.Empty}
    class:px-[8px]={type !== MessageType.Empty}
    class:info={type === MessageType.Info}
    class:success={type === MessageType.Success}
    class:warning={type === MessageType.Warning}
    class:error={type === MessageType.Error}
>
    {#if type === MessageType.Info}
        <InfoIcon />
    {:else if type === MessageType.Success}
        <SuccessIcon />
    {:else if type === MessageType.Warning}
        <WarningIcon />
    {:else if type === MessageType.Error}
        <ErrorIcon />
    {/if}
    <div>
        <slot />
    </div>
</div>

<style lang="scss">
    @import 'Message.scss';
</style>
