<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from "svelte"
    import Image from "./Image.svelte"
    import UUID from "$lib/modules/utils/uuid"
    import type { Image as ImageClass } from "$lib/repos/images"
    import debounce from "$lib/modules/utils/debounce"

    const id = new UUID().id
    export let urls: string[] = []
    export let images: ImageClass[] = []
    export let autoscroll: boolean = false
    export let scrollById: string = 'main'

    export let height: number
    export let fit: string = 'cover'

    let thisEl: HTMLElement
    let scrollByEl: HTMLElement
    let timeout: number
    let requesting: boolean = false
    let killRequesting = debounce(function () {
        requesting = false
    }, 100)

    onMount(() => {
        document.getElementById(id)!.style.minHeight = `calc(${height * (urls.length ? 1 : 0)}px + 2rem)`
        if (autoscroll) initializeAutoscroll()
    })
    onDestroy(() => {
        window.clearTimeout(timeout)
    })

    const dispatch = createEventDispatcher()

    const initializeAutoscroll = () => {
        thisEl = document.getElementById(id)!
        scrollByEl = document.getElementById(scrollById)!
        scrollByEl.addEventListener('scroll', onScroll, false)
    }

    const onScroll = () => {
        if (!requesting) {
            requesting = true
            window.requestAnimationFrame(parallax)
        }
        killRequesting()
    }

    const parallax = () => {
        const ratio = scrollByEl.scrollTop / (scrollByEl.scrollHeight - scrollByEl.offsetHeight)
        console.log(ratio)
        thisEl.scroll({ left: (thisEl.scrollWidth - thisEl.offsetWidth) * ratio })

        if (requesting) window.requestAnimationFrame(parallax)
    }
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