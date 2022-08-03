<script lang="ts">
    import { fade, scale } from 'svelte/transition';
</script>

<div class="messsage" transition:fade={{ duration: 400 }}>
    <slot />
</div>

<style lang="scss">
    @import 'Message.scss';
</style>
