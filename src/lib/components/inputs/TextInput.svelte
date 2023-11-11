<script lang="ts">
    import UUID from "$lib/modules/utils/uuid"
	import { onMount } from "svelte"
    const id: string = new UUID().id
    const labelId: string = new UUID().id

    export let label: string
    export let type: string = 'text'

    export let value: string = ''

    let initialTop: string

    const shiftLabel = () => {
        const label = document.getElementById(labelId)!
        label.style.top = '0'
        label.style.transform = 'translateY(-60%)'
    }
    const unshiftLabel = () => {
        if (value) return
        const label = document.getElementById(labelId)!
        label.style.top = initialTop
        label.style.transform = ''
    }

    const updateValue = (event: InputEvent) => {
        value = (event.target as HTMLInputElement).value
    }

    onMount(() => {
        if (type !== 'password') type = 'text'
        initialTop = document.getElementById(labelId)!.style.transform
    })
</script>


<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    <label id={labelId} for={id}>{label}</label>
    <input 
        {id} 
        {type} 
        {value} 
        on:focus={shiftLabel} 
        on:blur={unshiftLabel} 
        on:input={updateValue} 
    />
</div>


<style lang="scss">
    @import "$lib/styles/themes.scss";

    div {
        display: flex;
        flex-direction: column;
        position: relative;
    }
    label {
        position: absolute;
        top: 0.6rem;
        left: 0.6rem;
        transition: all 300ms ease;
    }
    input {
        padding: 0.6rem;
        background: none;


        border: none;
        border-left: 0.1rem solid $black;
        border-bottom: 0.1rem solid $black;
        border-bottom-left-radius: 0.25rem;

        font-size: 1rem;
    }
    input:focus {
        outline: none;
    }
</style>