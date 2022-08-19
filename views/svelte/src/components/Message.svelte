<script lang="ts">
</script>

<div class="text-white text-base select-none fade-in">
    <slot />
</div>

<style lang="scss">
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
