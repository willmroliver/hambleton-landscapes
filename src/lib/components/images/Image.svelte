<script lang="ts">
    export let fit: string = 'cover'
    export let render: boolean = true
    export let square: boolean = false

    $: imageClass = `${fit} ${render ? '' : 'norender'} ${square ? 'square' : ''}`
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img 
    id={$$restProps.id}
    src={render ? $$restProps.src : ''} 
    alt={$$restProps.alt} 
    class={`${imageClass} ${$$restProps.class || ''}`}
    height={$$restProps.height || ''}
    on:click
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
    .norender {
        display: none;
    }
    .square { 
        aspect-ratio: 1;
    }
    img {
        max-width: 100%;
        max-height: calc(100vh - 3rem);
    }
</style>