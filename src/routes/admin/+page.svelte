<script lang="ts">
    import ImageUpload from "$lib/components/inputs/ImageUpload.svelte"
    import Image from "$lib/components/general/Image.svelte"

    import session from "$lib/stores/session"
    import { upload } from "$lib/modules/storage/storage"
    import { list } from "$lib/modules/storage/image"
	import { onMount } from "svelte";

    let success = false

    let images: string[] = []

    const saveImage = async (file: File|Blob|null) => {
        try {
            if (!file || !$session.uid) return
            const res = await upload('admin/images', file as File)

            console.log(res)
            success = true
        } catch (err) {
            console.error(err)
        }
    }

    onMount(async () => {
        const { urls, next } = await list('admin/images')
        images = urls
    })
</script>

<ImageUpload theme="secondary" height={300} {saveImage} class="upload" />

{#each images as src}
    <Image {src} height={200} class="image" />
{/each}

{#if success}
<div>
    Your image has been saved to the cloud.
</div>
{/if}

<style lang="scss">
    :global(.upload) {
        margin-top: 2rem;
    }

    :global(.image) {
        margin-top: 2rem;
    }

    div {
        margin-top: 2rem;
    }
</style>