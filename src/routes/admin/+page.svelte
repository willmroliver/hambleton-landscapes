<script lang="ts">
    import ImageSelector from "$lib/components/inputs/ImageSelector.svelte"
    import ImageCarousel from "$lib/components/images/ImageCarousel.svelte"
    import Image from "$lib/components/images/Image.svelte"
	import Icon from "$lib/components/general/Icon.svelte"
	import Modal from "$lib/components/general/Modal.svelte"
    import Button from "$lib/components/inputs/Button.svelte"
    import TextInput from "$lib/components/inputs/TextInput.svelte"
    import TextArea from "$lib/components/inputs/TextArea.svelte"
    import Draggable from "$lib/components/general/Draggable.svelte";

    import { Gallery, GalleryRepo } from "$lib/repos/galleries"
    import type { Image as ImageClass } from "$lib/repos/images"
	import { onMount } from "svelte"

    let galleryRepo = new GalleryRepo()
    let galleries: Gallery[] = []
    let selectedImages: any = {}
    let selectedGallery: Gallery|null = null
    let selectedImage: ImageClass|null = null
    let showDeleteGallery: boolean = false

    let title: string = ''
    let body: string = ''

    let loading: boolean = true
    let submitting: boolean = false

    let uploading: number = 0
    let uploaded: number = 0

    onMount(async () => {
        await loadGalleries()
        loading = false
    })
    
    const loadGalleries = async () => {
        try {
            let _galleries = await galleryRepo.list()

            for (const g of _galleries) {
                await g.loadImages()
                selectedImages[g.id!] = []
            }
            galleries = _galleries
        } catch (err) {
            console.error(err)
        }
    }

    const createNewGallery = async () => {
        if (submitting) return
        submitting = true

        try {
            const gallery = await galleryRepo.create(new Gallery('', title, body))
            galleries = [...galleries, gallery]

            title = ''
            body = ''
        } catch(err) {
            console.error(err)
        } finally {
            submitting = false
        }
    }

    const updateGallery = async (gallery: Gallery) => {
        if (submitting) return
        submitting = true

        try {
            await galleryRepo.update(gallery)
        } catch(err) {
            console.error(err)
        } finally {
            submitting = false
        }
    }

    const deleteGallery = async () => {
        if (!selectedGallery || submitting) return
        submitting = true

        try {
            await galleryRepo.remove(selectedGallery)
            await loadGalleries()
        } catch (err) {
            console.error(err)
        } finally {
            submitting = false
            selectedGallery = null
        }
    }

    const selectImages = (gallery: Gallery, images: object[]) => {
        selectedImages[gallery.id!] = images
        selectedImages = { ...selectedImages }
    }

    const clearSelected = (galleryId: string) => {
        delete selectedImages[galleryId]
        selectedImages = { ...selectedImages }
    }

    const saveImages = async (gallery: Gallery) => {
        const selected = selectedImages[gallery.id!]
        if (!selected) return

        uploading = selected.length
        uploaded = 0

        for (let i = 0; i < uploading; ++i) {
            await gallery.uploadImage(selected[i].file)
            ++uploaded
        }

        delete selectedImages[gallery.id!]

        galleries = [ ...galleries ]
    }

    const showRemoveDialog = (gallery: Gallery, image: ImageClass) => {
        if (!gallery.id) return
        
        selectedGallery = gallery
        selectedImage = image
    }

    const removeImage = async () => {
        if (submitting || !selectedGallery || !selectedImage) return
        submitting = true

        try {
            await selectedGallery.removeImage(selectedImage.id as string)
            await loadGalleries()
        } catch (err) {
            console.error(err)
        } finally {
            selectedGallery = null
            selectedImage = null
            submitting = false
        }
    }

    let from: string
    let start: number

    const drag = (gallery: string, index: number) => {
        from = gallery
        start = index
    }

    const drop = (gallery: string, index: number) => {
        if (from !== gallery) {
            from = ''
            return
        }

        const move = selectedImages[from].splice(start, 1)

        selectedImages[from] = [
            ...selectedImages[from].slice(0, index), 
            move[0], 
            ...selectedImages[from].slice(index),
        ]

        selectedImages = { ...selectedImages }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#each galleries as gallery, i}
<div class={`${i % 2 ? 'dark' : 'background'} ${i == galleries.length - 1 ? 'end' : ''} wrapper`}>
    <section>
        <div class="header">
            <!-- Section Title -->
            <TextInput 
                bind:value={gallery.title}
                label="Title"  
                theme={i % 2 ? 'light' : 'dark'} 
            />
            <ImageSelector 
                label="Add images"
                theme="secondary" 
                saveTheme={i % 2 ? 'light' : 'dark'}
                multiple={true}
                preview={false}
                on:change={(event) => { selectImages(gallery, event.detail) }}
                on:save={() => { saveImages(gallery) } }
                on:cancel={() => { clearSelected(gallery.id || '') }}
            />
        </div>

        <!-- Image Upload Previews -->
        {#if gallery.id && selectedImages[gallery.id] && selectedImages[gallery.id].length}
            <div class="preview">
                {#each selectedImages[gallery.id] as image, i}
                    <Draggable
                        data={({ gallery: gallery.id, index: i })}
                        on:drag={event => { drag(event.detail.gallery, event.detail.index) }}
                        on:drop={event => { drop(event.detail.gallery, event.detail.index) }}
                    >
                        <Image src={image.url} height={75} square={true} />
                    </Draggable>
                {/each}
            </div>
        {/if}

        <!-- Uploaded Images -->
        {#if gallery.images && gallery.images.length}
            <ImageCarousel 
                images={gallery.images} 
                height={150}
                on:select={(event) => showRemoveDialog(gallery, event.detail)}
            />
        {/if}
        
        <!-- Section Text -->
        <TextArea 
            bind:value={gallery.body} 
            label="Section text" 
            rows={8} 
            class="body" 
            theme={i % 2 ? 'light' : 'dark'}
        />

        <!-- Actions -->
        <div class="footer">
            <Button 
                theme={i % 2 ? 'light' : 'dark'}
                on:click={() => updateGallery(gallery)}
            >
                Save changes
                {#if submitting}
                    <Icon name="circle-notch" animate="spin" append="end" />
                {/if}
            </Button>

            <Button 
                theme="danger"
                on:click={() => { selectedGallery = gallery; showDeleteGallery = true }}
            >
                Delete<Icon name="trash" append="end"/>
            </Button>
        </div>
        
    </section>
</div>
{/each}

<div class="new-gallery">
    <form>
        <TextInput label="title" bind:value={title} />
        <TextArea label="body" bind:value={body} rows={12} />
        <Button theme="dark" on:click={createNewGallery}>New Gallery</Button>
    </form>
</div>

<Modal open={!!selectedImage}>
    <Image src={selectedImage?.url} />
    <Button theme="danger" on:click={removeImage}>
        Delete 
        {#if !submitting}<Icon name="trash" append="end" />
        {:else}<Icon name="circle-notch" animate="spin" append="end" />
        {/if}
    </Button>
</Modal>

<Modal open={showDeleteGallery} on:close={() => { showDeleteGallery = false }}>
    <div style="font-size: 1.5rem; font-weight: bold">Are you sure?</div>
    <div style="max-width: 400px; margin: 1rem 0;">All files associated to this gallery will be deleted. This action cannot be reversed</div>
    <div style="display: flex; align-items: center; flex-grow: 1; gap: 0.5rem;">
        <Button theme="dark" on:click={() => { showDeleteGallery = false }} style="flex: 1 1 0px; width: 0;">
            Cancel<Icon name="x" append="end" />
        </Button>

        <Button theme="danger" on:click={deleteGallery} style="flex: 1 1 0px; width: 0;">
            Delete
            {#if !submitting}<Icon name="trash" append="end" />
            {:else}<Icon name="circle-notch" animate="spin" append="end" />
            {/if}
        </Button>
    </div>
</Modal>

<Modal open={!!uploading} blocking={true}>
    {#if uploading !== uploaded}
        <div>Uploading {uploaded}/{uploading}</div>
        <Icon name="circle-notch" animate="spin" style="align-self: center" />
    {:else}
        <div>Upload completed</div>
        <Button theme="dark" on:click={() => { uploading = 0; uploaded = 0 }}>Done</Button>
    {/if}
</Modal>

<style lang="scss">
    @import "$lib/styles/themes.scss";
    @import "$lib/styles/breakpoints.scss";

    .wrapper {
        width: 100%;
        padding: 2rem 0.5rem 1rem;
        z-index: 1;

        :global(img) {
            border-radius: 0.25rem;
            box-shadow: 5px 5px 1px 0 rgba(0,0,0,0.2);
        }
    }
    .wrapper:first-of-type {
        padding-top: 5rem;
    }
    .wrapper:last-of-type {
        margin-bottom: 2rem;
        box-shadow: 0 10px 10px 0 rgba(0,0,0,0.08);
    }
    .wrapper.end {
        box-shadow: 0 0.5rem 0.5rem 0 rgba(0,0,0,0.1);
    }
    section {
        width: 100%;

        .header, .footer {
            display: flex;
            align-items: end;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            gap: 1rem;
        }

        :global(.body) {
            margin-bottom: 2rem;
        }
    }
    .preview {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        margin-bottom: 0.5rem;
    }
    .new-gallery {
        position: sticky;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 100%;
        min-height: 100%;
        padding: 1rem;

        form {
            display: flex;
            flex-direction: column;

            gap: 1rem;
            width: clamp(0px, 100%, 400px);
        }
    }

    div > * {
        max-width: 600px;
        margin: 0 auto;
    }
</style>