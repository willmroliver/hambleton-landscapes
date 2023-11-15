<script lang="ts">
    export let fit: string = 'cover';
    export let height: string|number;
</script>

<img 
    src={$$restProps.src} 
    alt={$$restProps.alt} 
    class={`${fit} ${$$restProps.class || ''}`}
    {height}
    style="max-width: 100vw"
/>

<style lang="scss">
    .fill {
        object-fit: fill;
    }
    .contain {
        object-fit: contain;
    }
    .cover {
        object-fit: cover;
    }
</style>