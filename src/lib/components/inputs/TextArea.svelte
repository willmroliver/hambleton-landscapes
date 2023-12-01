<script lang="ts">
    import UUID from "$lib/modules/utils/uuid"
    import { Theme } from '$lib/enums/theme'

    const id = new UUID().id
    const labelId = new UUID().id

    export let label: string
    export let value: string = ''
    export let rows: number = 5
    export let theme: Theme|string = Theme.dark;

    $: labelClass = `${theme}-label`
    $: inputClass = `${theme}-input`
    $: borderClass = `${theme}-border`
</script>

<div 
    class={$$restProps.class || ''}
    style={$$restProps.style || ''}
>
    <label id={labelId} for={id} class={labelClass}>{label}</label>
    <form class={`${inputClass} ${borderClass}`}>
        <textarea 
            {id} 
            bind:value={value} 
            {rows} 
            placeholder={$$restProps.placeholder}
            name={$$restProps.name}
            form={$$restProps.form}
        />
    </form>
</div>

<style lang="scss">
    @import "$lib/styles/colors.scss";
    @import "$lib/styles/inputs.scss";
    
    div {
        display: flex;
        flex-direction: column;

        label {
            margin-left: $pd-in;
            transform: translateY(0.3rem);
            width: 100%;
            font-size: $label-fs
        }
        form {
            padding-top: calc($pd-in - (2 * $border-w));
            padding-bottom: $pd-in;

            textarea {
                padding: 0 $pd-in;
                font: inherit;
                font-size: $input-fs;
                font-weight: 600;
                background: none;
                border: none;
                width: calc(100% - 2*($pd-in - (2 * $border-w)))
            }
            textarea:focus {
                outline: none;
            }
        }
    }
    div > * {
        width: inherit;
    }
    
</style>