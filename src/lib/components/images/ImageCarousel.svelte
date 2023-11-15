<script lang="ts">
	import { onMount } from "svelte";
    import Image from "./Image.svelte"
    import UUID from "$lib/modules/utils/uuid";

    const id = new UUID().id
    export let urls: string[] = []
    export let height: number
    export let fit: string = 'cover'

    onMount(() => {
        document.getElementById(id)!.style.minHeight = `calc(${height * (urls.length ? 1 : 0)}px + 2rem)`
    })
</script>

<div {id} >
    {#each urls as src}
    <Image {src} {height} {fit} />
    {/each}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        max-width: 100vw;

        gap: 1rem;
        padding: 1rem 0;
    }
</style>