<script lang="ts">
    import ImageUpload from "$lib/components/inputs/ImageUpload.svelte"
    import ImageCarousel from "$lib/components/images/ImageCarousel.svelte"

    import Button from "$lib/components/inputs/Button.svelte"
    import TextInput from "$lib/components/inputs/TextInput.svelte"
    import TextArea from "$lib/components/inputs/TextArea.svelte"

    import { Gallery, GalleryRepo } from "$lib/repos/galleries"
    import { Image as ImageClass, ImageRepo } from "$lib/repos/images"

	import { onMount } from "svelte"
	import Image from "$lib/components/images/Image.svelte";
	import Icon from "$lib/components/general/Icon.svelte";

    let galleryRepo = new GalleryRepo()
    let galleries: Gallery[] = []
    let galleryPreviews: any = {}

    let imageRepo: ImageRepo|null = null
    let selectedGallery: Gallery|null = null
    let selectedImage: ImageClass|null = null

    onMount(async () => {
        let _galleries = await galleryRepo.list()

        for (const g of _galleries) {
            await g.loadImages()
            galleryPreviews[g.title] = []
        }

        galleries = _galleries
    })

    let title: string = ''
    let body: string = ''
    
    const createNewGallery = () => {
        if (!title) return

        galleries = [...galleries, new Gallery(title, body)]
        galleryRepo.write(galleries[galleries.length-1])

        title = ''
        body = ''
    }

    const showRemoveDialog = (gallery: Gallery, image: ImageClass) => {
        imageRepo = new ImageRepo(gallery.title)
        selectedGallery = gallery
        selectedImage = image
    }

    const removeImage = async () => {
        try {
            await imageRepo!.remove(selectedImage!)

            const _galleries = galleries
            _galleries.forEach(g => {
                if (g.title !== selectedGallery!.title) return
                g.images = g.images.filter(image => `${image.path}/${image.name}` !== `${selectedImage!.path}/${selectedImage!.name}`)
            })

            galleries = [..._galleries]
        } catch (err) {
            console.error(err)
        } finally {
            imageRepo = null
            selectedGallery = null
            selectedImage = null
        }
    }
</script>

{#each galleries as gallery, i}
<div class={`${i % 2 ? 'dark' : 'light'} wrapper`}>
    <section>
        <div class="header">
            <TextInput 
                bind:value={gallery.title}
                label="Title"  
                theme={i % 2 ? 'light' : 'dark'} 
            />
            <ImageUpload 
                saveImage={async (f) => {gallery.saveImage(f)}} 
                label="Add images"
                theme="secondary" 
                height={100}
                multiple={true}
                preview={false}
                on:select={(event) => galleryPreviews[gallery.title] = event.detail.urls}
                on:reset={() => galleryPreviews[gallery.title] = []}
            />
        </div>

        {#if galleryPreviews[gallery.title].length}
            <ImageCarousel urls={galleryPreviews[gallery.title]} height={100} />
        {/if}

        {#if gallery.images.length}
        <ImageCarousel 
            images={gallery.images} 
            height={100}
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


{#if selectedImage}
    <div 
        class="modal-bg" 
        on:click={() => selectedImage = null}
        on:keyup={() => selectedImage = null}
        role="button"
        tabindex={0}
    >
        <div class="modal-wrapper">
            <div class="modal-content">
                <Image src={selectedImage.url} height={300} />
                <Button theme="danger" on:click={removeImage}>
                    Delete<Icon name="trash" style="margin-left: 0.5rem" />
                </Button>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    @import "$lib/styles/themes.scss";
    @import "$lib/styles/breakpoints.scss";

    :global(.upload) {
        margin-top: 2rem;
    }

    :global(.image) {
        margin-top: 2rem;
    }

    :global(img), :global(button) {
        border-radius: 0.25rem;
        box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.2);
    }

    .wrapper {
        width: 100%;
        padding: 2rem;
        z-index: 1;
    }
    .wrapper:first-of-type {
        padding-top: 5rem;
    }
    .wrapper:last-of-type {
        margin-bottom: 2rem;
        box-shadow: 0 10px 10px 0 rgba(0,0,0,0.08);
    }
    section {
        width: 100%;

        .header {
            display: flex;
            align-items: end;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            gap: 1rem;
        }

        :global(.body) {
            margin-top: 0.5rem;
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

    .modal-bg {
        position: absolute;
        z-index: 100;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .modal-wrapper {
            max-width: calc(100% - 2rem);
            box-shadow: 0 0 500px 1000px rgba(0,0,0,0.5);
            animation: appear 300ms 1 ease;
            border-radius: 0.5rem;

            @keyframes appear {
                0% { opacity: 0 }
                100% { opacity: 1}
            }

            .modal-content {
                width: 100%;
                height: 100%;
                background-color: $white;
                border-radius: 0.5rem;
                border-top-right-radius: 0.5rem !important;

                display: flex;
                flex-direction: column;

                gap: 1rem;
                padding: 1rem;

                :global(img) {
                    max-width: 90%;
                }

                @include md {
                    padding: 2rem;
                    gap: 2rem;
                }
            }
        }
    }
</style>