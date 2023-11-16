<script lang="ts">
	import { Theme } from "$lib/enums/theme";
    import UUID from "$lib/modules/utils/uuid"
	import { onMount } from "svelte"
    const id: string = new UUID().id
    const labelId: string = new UUID().id

    export let label: string
    export let type: string = 'text'
    export let theme: Theme|string = Theme.dark
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

    const updateValue = (event: Event) => {
        value = (event.target as HTMLInputElement).value
    }

    onMount(() => {
        if (type !== 'password') type = 'text'
        initialTop = document.getElementById(labelId)!.style.transform

        if (value) shiftLabel()
    })

    $: labelClass = `${theme}-label`
    $: inputClass = `${theme}-input`
    $: borderClass = `${theme}-border`
</script>


<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    <label id={labelId} for={id} class={labelClass}>{label}</label>
    <input 
        {id} 
        {type} 
        {value} 
        on:focus={shiftLabel} 
        on:blur={unshiftLabel} 
        on:input={updateValue} 
        name={$$restProps.name}
        form={$$restProps.form}
        class={`${inputClass} ${borderClass}`}
        size={1}
    />
</div>


<style lang="scss">
    @import "$lib/styles/inputs.scss";

    div {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
    }
    label {
        position: absolute;
        top: $pd-in;
        left: $pd-in;
        transition: all 300ms ease;

        font-size: $label-fs;
    }
    input {
        padding: $pd-in;
        background: none;
        border: none;
        font-size: $input-fs;
        width: 100%;
        box-sizing: border-box;
    }
    input:focus {
        outline: none;
    }
</style>