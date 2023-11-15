<script lang="ts">
    import Button from "./Button.svelte"
    import Icon from "../general/Icon.svelte"
    import UUID from "$lib/modules/utils/uuid"
    import { createEventDispatcher, onMount } from "svelte"

    export let accept: string = ''
    export let label: string = 'Select a file'
    export let theme: string = 'primary'
    export let multiple: boolean = false

    const id: string = new UUID().id
    const dispatch = createEventDispatcher()

    let input: HTMLInputElement
    let files: FileList|null = null;

    onMount(() => {
        input = document.getElementById(id)! as HTMLInputElement
    })

    const click = () => {
        document.getElementById(id)?.click()
    }

    const select = () => {
        if (input.files && input.files[0]) {
            files = input.files
            dispatch('change', multiple ? { files } : { file: files[0] })
        }
        
        else files = null
    }

</script>

<label for={id}>
    <Button {theme} on:click={click}>
        <slot>{ label }<Icon name="arrow-up-from-bracket" style="margin-left: 0.5rem" /></slot>
    </Button>
</label>

<input 
    {id} 
    {accept} 
    {multiple} 
    type="file"
    hidden={true} 
    on:change={select} 
/>

<slot />