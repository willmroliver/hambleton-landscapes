<script lang="ts">
    import Button from "./Button.svelte"
    import UUID from "$lib/modules/utils/uuid"
    import { createEventDispatcher } from "svelte"

    export let accept: string = ''
    export let label: string = 'Select a file'
    export let theme: string = 'primary'

    const id: string = new UUID().id
    const dispatch = createEventDispatcher()

    let file: File|Blob|null = null;

    const click = () => {
        document.getElementById(id)?.click()
    }

    const selectFile = () => {
        const el = (document.getElementById(id)! as HTMLInputElement)

        if (el.files && el.files[0]) file = el.files[0]
        else file = null

        dispatch('change', { file })
    }
</script>

<label for={id}>
    <Button {theme} on:click={click}>{ label }</Button>
</label>
<input {id} type="file" {accept} hidden={true} on:change={selectFile}/>

<slot />