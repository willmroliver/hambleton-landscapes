<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
    const dispatch = createEventDispatcher()

    import Image from "./Image.svelte"
    import UUID from "$lib/modules/utils/uuid"
    import type { Image as ImageClass } from "$lib/repos/images"
	import Button from "../inputs/Button.svelte";
	import Icon from "../general/Icon.svelte";

    const uuid = new UUID(document)
    export let urls: string[] = []
    export let images: ImageClass[] = []

    export let height: number
    export let fit: string = 'cover'
    export let render: boolean = true
    export let theme: string = 'dark'

    let carousel: HTMLElement

    const imageCount = () => {
        return (urls.length ? urls.length : images.length)
    }

    onMount(() => {
        carousel = document.getElementById(uuid.id)!
        carousel.style.minHeight = `calc(${height * (imageCount() ? 1 : 0)}px + 2rem)`
        shiftImageEls()
    })

    let index = 0
    
    const next = () => {
        if (index === imageCount() - 1) return
        ++index
        shiftImageEls()
    }

    const previous = () => {
        if (index === 0) return
        --index
        shiftImageEls()
    }

    /**
     * Returns the index of the first rendered image
     */
    $: lowBound = () => {
        return Math.max(0, index - 2)
    }

    /**
     * Returns 1 + the index of the last rendered image
     */
    $: upBound = () => {
        return Math.min(lowBound() + 4, imageCount())
    }

    const shiftImageEls = () => {
        const l = lowBound()
        const u = upBound()

        let diff
        let image

        for (let i = l; i < u; ++i) {
            image = uuid.element(i)!
            diff = index - i

            switch (diff) {
                case 0:
                    image.style.left = '50%'
                    image.style.transform = 'translateX(-50%)'
                    image.style.opacity = '1'
                    image.style.zIndex = '2'
                    break
                case -1:
                case 1:
                    image.style.left = diff < 0 ? '80%' : '20%'
                    image.style.transform = 'translateX(-50%) scale(0.5)'
                    image.style.opacity = '0.4'
                    image.style.zIndex = '1'
                    image.style.pointerEvents = ''
                    break
                default:
                    image.style.opacity = '0'
                    image.style.pointerEvents = 'none'
                    break
            }
        }
    }

</script>

<div id={uuid.id}>
    <Button {theme} on:click={previous}><Icon name="chevron-left" /></Button>
    {#if !images.length}
        {#each urls as src, i}
        <Image 
            id={uuid.composite(i)}
            {src} 
            {height} 
            {fit}
            render={lowBound() <= i && i < upBound() && render}
            class={i === index ? 'active' : ''}
            on:click={() => dispatch('select', src)}
        />
        {/each}
    {:else}
        {#each images as image, i}
        <Image 
            id={uuid.composite(i)}
            src={image.url}
            {height} 
            {fit} 
            render={lowBound() <= i && i < upBound() && render}
            class={i === index ? 'active' : ''} 
            on:click={() => dispatch('select', image)}
        />
        {/each}
    {/if}
    <Button {theme} on:click={next}><Icon name="chevron-right" /></Button>
</div>

<style lang="scss">
    div {
        position: relative;
        width: 100%;
        padding: 1rem 0 1.5rem 0;

        :global(img) {
            position: absolute;
            transition: all 200ms ease;
        }

        :global(button) {
            position: absolute;
            z-index: 3;
            top: calc(50% - 1.25rem);

            padding: 0.75rem;
        }

        :global(button:first-child) {
            left: 0;
        }

        :global(button:last-child) {
            right: 0;
        }
    }
</style>