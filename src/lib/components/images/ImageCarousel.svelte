<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
    import Image from "./Image.svelte"
    import UUID from "$lib/modules/utils/uuid";
    import type { Image as ImageClass } from "$lib/repos/images";

    const id = new UUID().id
    export let urls: string[] = []
    export let images: ImageClass[] = []

    export let height: number
    export let fit: string = 'cover'

    onMount(() => {
        document.getElementById(id)!.style.minHeight = `calc(${height * (urls.length ? 1 : 0)}px + 2rem)`
    })

    const dispatch = createEventDispatcher()
</script>

<div {id} >
    {#if !images.length}
        {#each urls as src}
        <Image 
            {src} 
            {height} 
            {fit} 
            class={$$restProps.class || ''} 
            on:click={() => dispatch('select', src)}
        />
        {/each}
    {:else}
        {#each images as image}
        <Image 
            src={image.url}
            {height} 
            {fit} 
            class={$$restProps.class || ''} 
            on:click={() => dispatch('select', image)}
        />
        {/each}
    {/if}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        max-width: 100vw;

        gap: 1rem;
        padding: 1rem 1.5rem 1.5rem 0;
    }
</style>