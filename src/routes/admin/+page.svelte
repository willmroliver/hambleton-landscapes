<script lang="ts">
    import ImageUpload from "$lib/components/images/ImageUpload.svelte"
    import ImageCarousel from "$lib/components/images/ImageCarousel.svelte"
    import Image from "$lib/components/images/Image.svelte"
	import Icon from "$lib/components/general/Icon.svelte"
	import Modal from "$lib/components/general/Modal.svelte"
    import Button from "$lib/components/inputs/Button.svelte"
    import TextInput from "$lib/components/inputs/TextInput.svelte"
    import TextArea from "$lib/components/inputs/TextArea.svelte"

    import { Gallery, GalleryRepo } from "$lib/repos/galleries"
    import { Image as ImageClass, ImageRepo } from "$lib/repos/images"

	import { onMount } from "svelte"


    let galleryRepo = new GalleryRepo()
    let galleries: Gallery[] = []
    let galleryPreviews: any = {}
    let selectedGallery: Gallery|null = null

    let imageRepo: ImageRepo|null = null
    let selectedImage: ImageClass|null = null

    let title: string = ''
    let body: string = ''

    let loading: boolean = true
    let submitting: boolean = false
    
    const loadGalleries = async () => {
        try {
            let _galleries = await galleryRepo.list()

            for (const g of _galleries) {
                await g.loadImages()
                galleryPreviews[g.title] = []
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

    const showRemoveDialog = (gallery: Gallery, image: ImageClass) => {
        if (!gallery.id) return
        
        imageRepo = new ImageRepo(gallery.id)
        selectedImage = image
    }

    const removeImage = async () => {
        if (submitting) return
        submitting = true

        try {
            await imageRepo!.remove(selectedImage!)
            await loadGalleries()
        } catch (err) {
            console.error(err)
        } finally {
            imageRepo = null
            selectedImage = null
            submitting = false
        }
    }

    onMount(async () => {
        await loadGalleries()
        loading = false
    })
</script>

{#each galleries as gallery, i}
<div class={`${i % 2 ? 'dark' : 'background'} ${i == galleries.length - 1 ? 'end' : ''} wrapper`}>
    <section>
        <div class="header">
            <TextInput 
                bind:value={gallery.title}
                label="Title"  
                theme={i % 2 ? 'light' : 'dark'} 
            />
            <ImageUpload 
                saveImage={async (f) => { await gallery.saveImage(f) }} 
                label="Add images"
                theme="secondary" 
                saveTheme={i % 2 ? 'light' : 'dark'}
                height={100}
                multiple={true}
                preview={false}
                on:select={(event) => galleryPreviews[gallery.title] = event.detail.urls}
                on:uploadend={loadGalleries}
                on:reset={() => galleryPreviews[gallery.title] = []}
            />
        </div>

        {#if 
            galleryPreviews[gallery.title] && 
            galleryPreviews[gallery.title].length
        }
            <ImageCarousel urls={galleryPreviews[gallery.title]} height={150} />
        {/if}

        {#if gallery.images && gallery.images.length}
            <ImageCarousel 
                images={gallery.images} 
                height={150}
                on:select={(event) => showRemoveDialog(gallery, event.detail)}
            />
        {/if}
        
        <TextArea 
            bind:value={gallery.body} 
            label="Section text" 
            rows={8} 
            class="body" 
            theme={i % 2 ? 'light' : 'dark'}
        />

        <div class="footer">
            <Button 
                theme={i % 2 ? 'light' : 'dark'}
                on:click={() => updateGallery(gallery)}
            >{#if !submitting}
                Save changes
            {:else}
                <Icon name="circle-notch" animate="spin" />
            {/if}
            </Button>

            <Button 
                theme="danger"
                on:click={() => selectedGallery = gallery}
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
    <Image src={selectedImage?.url} height={300} />
    <Button theme="danger" on:click={removeImage}>
        Delete 
        {#if !submitting}<Icon name="trash" append="end" />
        {:else}<Icon name="circle-notch" animate="spin" append="end" />
        {/if}
    </Button>
</Modal>

<Modal open={!!selectedGallery}>
    <div style="font-size: 1.5rem; font-weight: bold">Are you sure?</div>
    <div style="max-width: 400px; margin: 1rem 0;">All files associated to this gallery will be deleted. This action cannot be reversed</div>
    <div style="display: flex; align-items: center; flex-grow: 1; gap: 0.5rem;">
        <Button theme="dark" on:click={selectedGallery = null} style="flex: 1 1 0px; width: 0;">
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

<style lang="scss">
    @import "$lib/styles/themes.scss";
    @import "$lib/styles/breakpoints.scss";

    .wrapper {
        width: 100%;
        padding: 2rem 0.5rem 1rem;
        z-index: 1;

        :global(button) {
            box-shadow: 2px 2px 5px 0 rgba(0,0,0,0.1);
        }
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