<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import UUID from "$lib/modules/utils/uuid"
    import { upload } from "$lib/modules/storage/cloud"
    import session from "$lib/stores/session"

    import Image from "$lib/components/general/Image.svelte"
    import FileUpload from "$lib/components/inputs/FileUpload.svelte"
    import Button from "./Button.svelte"


    export let height: string|number = 150
    export let label: string = 'Select an image'
    export let theme: string = 'dark'

    export let saveImage = (f: File|Blob|null) => {
        if (!f || !$session.uid) return

        upload(`user/${$session.uid}/images`, f as File)
    }

    const id: string = new UUID().id
    const dispatch = createEventDispatcher()

    let file: File|Blob|null = null
    let url: string = ''

    const getFileAndUrl = (event: any) => {
        file = event.detail.file as Blob
        const reader = new FileReader()

        reader.onloadend = () => {
            url = reader.result as string
        }

        reader.readAsDataURL(file)
    }

    const resetInput = () => {
        file = null
        url = ''
    }
</script>

<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    {#if url}
    <Image id={id} src={url} alt="Image Upload Preview" height={height} />
    {/if}
    
    {#if !file}
    <FileUpload 
        {theme}
        {label} 
        accept="image/jpeg, image/png, image/svg, image/jpg" 
        on:change={getFileAndUrl}
    />
    {:else}
    <slot>
        <span>
            <Button 
                theme="dark" 
                class="image-upload-options"
                on:click={() => saveImage(file)}
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
    div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        border-radius: 0.25rem;
    }
    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
        gap: 0.25rem;

        :global(.image-upload-options) {
            flex: 1 1 0px;
            width: 0;
        }
    }
</style>
