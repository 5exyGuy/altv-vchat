<script lang="ts">
    export let shape: 'rounded' | 'square' = 'rounded';
</script>

<button class="button" class:button-rounded={shape === 'rounded'} class:button-square={shape === 'square'} on:click>
    <slot />
</button>

<style lang="scss">
    @import 'Button.scss';
</style>
