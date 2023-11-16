<script lang="ts">
	import { createEventDispatcher } from "svelte"

    export let fit: string = 'cover'
    export let height: string|number

    const dispatch = createEventDispatcher()
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img 
    src={$$restProps.src} 
    alt={$$restProps.alt} 
    class={`${fit} ${$$restProps.class || ''}`}
    {height}
    style="max-width: 100vw"
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
</style>