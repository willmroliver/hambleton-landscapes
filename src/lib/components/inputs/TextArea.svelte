<script lang="ts">
    import UUID from "$lib/modules/utils/uuid"
    const id = new UUID().id
    const labelId = new UUID().id

    export let label: string
    export let value: string = ''
    export let rows: number = 5
</script>

<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    <label id={labelId} for={id}>{label}</label>
    <textarea 
        {id} 
        bind:value={value} 
        {rows} 
        placeholder={$$restProps.placeholder}
        name={$$restProps.name}
        form={$$restProps.form}
    />
</div>

<style lang="scss">
    @import "$lib/styles/themes.scss";
    
    div {
        display: flex;
        flex-direction: column;

        label {
            margin-left: 0.6rem;
            transform: translateY(0.3rem);
        }
        textarea {
            padding: 0.6rem;
            font: inherit;
            font-size: inherit;

            background: none;
            border: none;
            border-left: 0.1rem solid $black;
            border-bottom: 0.1rem solid $black;
            border-bottom-left-radius: 0.25rem;
        }
        textarea:focus {
            outline: none;
        }
    }
    div > * {
        width: inherit;
    }
    
</style>