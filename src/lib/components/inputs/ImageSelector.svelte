<script lang="ts">
    import UUID from "$lib/modules/utils/uuid"

    import Image from "$lib/components/images/Image.svelte"
    import ImageCarousel from "../images/ImageCarousel.svelte"
    import FileSelector from "$lib/components/inputs/FileSelector.svelte"
    import Button from "./Button.svelte"
	import { createEventDispatcher } from "svelte";

    export let height: number = 100
    export let multiple: boolean = false
    export let preview: boolean = true
    export let label: string = `Select ${multiple ? 'images' : 'an image'}`
    export let theme: string = 'dark'
    export let saveTheme: string = 'dark'

    let images: any[] = []
    let image: any = null

    const id: string = new UUID().id
    const dispatch = createEventDispatcher()
   
    const fileToUrl = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
        })
    }

    const select = async (event: any) => {
        let url: string

        if (multiple) {
            const files = event.detail.files
    
            for (let i = 0; i < files.length; ++i) {
                images = [ ...images, { 
                    file: files[i], 
                    url: await fileToUrl(files[i]) 
                }]
            }

            dispatch('change', images)
        }
        else {
            url = await fileToUrl(event.detail.file)
            image = { file: event.detail.file, url }
            dispatch('change', image)
        }
    }

    const reset = () => {
        images = []
        image = null
    }

    const cancel = () => {
        dispatch('cancel')
        reset()
    }
</script>

<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    {#if !multiple && image && preview}
        <Image id={id} src={image.url} alt="Image Upload Preview" height={height} />
    {:else if images.length && preview}
        <ImageCarousel urls={images.map(i => i.url)} {height} />
    {/if}
    
    {#if !image && !images.length}
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
                    on:click={() => { dispatch('save', [...images]); reset() }}
                >
                    Save
                </Button>

                <Button 
                    theme="danger" 
                    class="image-upload-options"
                    on:click={cancel}
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
