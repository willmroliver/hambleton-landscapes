<script lang="ts">
    import UUID from "$lib/modules/utils/uuid"
    import { upload } from "$lib/modules/storage/storage"
    import session from "$lib/stores/session"

    import Image from "$lib/components/images/Image.svelte"
    import ImageCarousel from "./ImageCarousel.svelte"
    import FileSelector from "$lib/components/inputs/FileSelector.svelte"
    import Button from "../inputs/Button.svelte"
	import { createEventDispatcher } from "svelte";
	import Modal from "../general/Modal.svelte";

    export let height: number = 100
    export let multiple: boolean = false
    export let preview: boolean = true
    export let label: string = `Select ${multiple ? 'images' : 'an image'}`
    export let theme: string = 'dark'
    export let saveTheme: string = 'dark'

    let file: File|Blob|null = null
    let files: FileList|null = null
    let url: string = ''
    let urls: string[] = []
    let submitting: boolean = false
    let success: boolean = false
    let uploaded: number = 0

    export let saveImage = async (f: File|Blob|null) => {
        if (!f || !$session.uid) return

        await upload(f as File,'user', $session.uid, 'images')
    }

    const id: string = new UUID().id
    const dispatch = createEventDispatcher()
   
    const getReader = () => {
        const reader = new FileReader()
        reader.onloadend = () => {
            if (multiple) urls = [...urls, reader.result as string]
            else url = reader.result as string
            dispatch('select', {
                url,
                file,
                urls,
                files,
            })
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
        dispatch('reset')
    }

    const saveAndReset = async () => {
        if (submitting) return
        submitting = true

        success = false
        dispatch('uploadstart')

        try {
            if (multiple && files) {
                for (const f of files) {
                    await saveImage(f)
                    ++uploaded
                }
            } 
            else {
                await saveImage(file)
                ++uploaded
            }
            
            success = true
            resetInput()
        } catch (err) {
            console.error(err)
        } finally {
            submitting = false
            uploaded = 0
            dispatch('uploadend')
        }
    }
</script>

<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    {#if !multiple && url && preview}
        <Image id={id} src={url} alt="Image Upload Preview" height={height} />
    {:else if urls.length && preview}
        <ImageCarousel {urls} {height} />
    {/if}
    
    {#if !file && !files}
        <FileSelector 
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
                    theme={saveTheme} 
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

<Modal open={submitting || success} blocking={true}>
    <div>
        {#if submitting} Upload in progress. {uploaded}/{files?.length} completed
        {:else} Upload complete.
        {/if}
    </div>
    <div>
        <Button theme={success ? 'primary' : 'danger'} on:click={() => success = false}>Close</Button>
    </div>
</Modal>

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
