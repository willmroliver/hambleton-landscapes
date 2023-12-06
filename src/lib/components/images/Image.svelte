<script lang="ts">
	import { createEventDispatcher } from "svelte"

    export let fit: string = 'cover'
    export let render: boolean = true

    const dispatch = createEventDispatcher()
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img 
    id={$$restProps.id}
    src={render ? $$restProps.src : ''} 
    alt={$$restProps.alt} 
    class={`${fit} ${render ? '' : 'norender'} ${$$restProps.class || ''}`}
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
    img {
        max-width: 100%;
        max-height: calc(100vh - 3rem);
    }
</style>