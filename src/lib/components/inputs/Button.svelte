<script lang="ts">
    import { onMount } from 'svelte'
    import UUID from "$lib/modules/utils/uuid"
	import { Theme } from '$lib/enums/theme'

    const id: string = new UUID().id
    
    export let type: any = 'button'
    export let theme: Theme|string = Theme.primary

    onMount(() => {
        document.getElementById(id)!.classList.add(theme);
    })
</script>

<button 
    {id} 
    {type} 
    class={$$restProps.class || ''} 
    style={$$restProps.style || ''}
    form={$$restProps.form}
    on:click
>
    <slot />
</button>

<style lang="scss">
    @import "$lib/styles/themes.scss";

    button {
        font-size: 1rem;
        text-wrap: nowrap;
        white-space: nowrap;

        border: none;
        border-radius: 0.25rem;

        padding: 0.5rem;

        cursor: pointer;

        transition: all 200ms ease;
        position: relative;
        overflow: hidden;

        -webkit-tap-highlight-color:  transparent;
    }

    button:after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;

        background-color: $white;

        padding-bottom: 200%;
        padding-right: 200%;

        opacity: 0;
        border-radius: 100rem;

        transition: all 0.8s ease-out;

        transform: translate(-50%, -50%);
    }

    button:active {
        transform: scale(0.95);
    }
    button:active:after {
        padding: 0;
        opacity: 0.4;
        transition: 0s;
    }
</style>