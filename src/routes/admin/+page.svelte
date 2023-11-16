<script lang="ts">
    import ImageUpload from "$lib/components/inputs/ImageUpload.svelte"
    import ImageCarousel from "$lib/components/images/ImageCarousel.svelte"

    import Button from "$lib/components/inputs/Button.svelte"
    import TextInput from "$lib/components/inputs/TextInput.svelte"
    import TextArea from "$lib/components/inputs/TextArea.svelte"

    import { Gallery, GalleryRepo } from "$lib/repos/galleries"
	import { onMount } from "svelte";

    let galleryRepo = new GalleryRepo()
    let galleries: Gallery[] = []

    let title: string = ''
    let body: string = ''
    
    const createNewGallery = () => {
        galleries = [...galleries, new Gallery(title, body)]
        galleryRepo.write(galleries[galleries.length-1])

        title = ''
        body = ''
    }

    onMount(async () => {
        let _galleries = await galleryRepo.list()
        for (const g of _galleries) await g.loadImages()
        galleries = _galleries
    })
</script>

{#each galleries as gallery}
    <h2>{gallery.title}</h2>
    <ImageUpload 
        saveImage={async (f) => {gallery.saveImage(f)}} 
        theme="secondary" 
        label="Add images"
        height={100}
        multiple={true}
    />

    <ImageCarousel urls={gallery.images.map(image => image.url)} height={100} />
    <p>{gallery.body}</p>
{/each}

<form>
    <TextInput label="title" bind:value={title} />
    <TextArea label="body" bind:value={body} />
    <Button theme="primary" on:click={createNewGallery}>New Gallery</Button>
</form>


<style lang="scss">
    :global(.upload) {
        margin-top: 2rem;
    }

    :global(.image) {
        margin-top: 2rem;
    }

    form {
        display: flex;
        flex-direction: column;

        gap: 1rem;
        margin-top: 2rem;
    }

    h2 {
        font-size: 2rem;
        margin: 1rem 0;
    }
</style>