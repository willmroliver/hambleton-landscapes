<script lang="ts">
    import UUID from "$lib/modules/utils/uuid"
    import { upload } from "$lib/modules/storage/storage"
    import session from "$lib/stores/session"

    import Image from "$lib/components/images/Image.svelte"
    import ImageCarousel from "../images/ImageCarousel.svelte"
    import FileUpload from "$lib/components/inputs/FileUpload.svelte"
    import Button from "./Button.svelte"

    export let height: string|number = 100
    export let multiple: boolean = false
    export let label: string = `Select ${multiple ? 'images' : 'an image'}`
    export let theme: string = 'dark'

    export let saveImage = async (f: File|Blob|null) => {
        if (!f || !$session.uid) return

        await upload(`user/${$session.uid}/images`, f as File)
    }

    const id: string = new UUID().id

    let file: File|Blob|null = null
    let files: FileList|null = null

    let url: string = ''
    let urls: string[] = []

    const getReader = () => {
        const reader = new FileReader()
        reader.onloadend = () => {
            if (multiple) urls = [...urls, reader.result as string]
            else url = reader.result as string
        }
        return reader
    }

    const select = (event: any) => {
        url = ''
        urls = []

        if (multiple) {
            const readers = []
            files = event.detail.files

            for (const f of files!) {
                readers.push(getReader())
                readers[readers.length-1].readAsDataURL(f)
            }
        }
        else {
            file = event.detail.file as Blob
            const reader = getReader()
            reader.readAsDataURL(file)
        }
    }

    const resetInput = () => {
        file = null
        files = null
        url = ''
        urls = []
    }

    const saveAndReset = async () => {
        if (multiple && files) {
            for (const f of files) await saveImage(f)
        } 
        else await saveImage(file)

        resetInput()
    }
</script>

<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    {#if !multiple && url}
        <Image id={id} src={url} alt="Image Upload Preview" height={height} />
    {:else if urls.length}
        <ImageCarousel {urls} {height} />
    {/if}
    
    {#if !file && !files}
        <FileUpload 
            {theme}
            {label} 
            {multiple}
            accept="image/jpeg, image/png, image/svg, image/jpg" 
            on:change={select}
        />
    {:else}
        <slot>
            <span>
                <Button 
                    theme="dark" 
                    class="image-upload-options"
                    on:click={saveAndReset}
                >
                    Save
                </Button>

                <Button 
                    theme="danger" 
                    class="image-upload-options"
                    on:click={resetInput}
                >
                    Cancel
                </Button>
            </span>
        </slot>
    {/if}
</div>

<style lang="scss">
    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
        gap: 0.25rem;
        width: 12rem;

        :global(.image-upload-options) {
            flex: 1 1 0px;
            width: 0;
        }
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
