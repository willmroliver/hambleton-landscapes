<script lang="ts">
	import { Theme } from "$lib/enums/theme"
    import UUID from "$lib/modules/utils/uuid"
    const id = new UUID().id

    export let label: string

    export let theme: Theme|string = Theme.primary

    export let value: boolean = false
</script>

<div class={`${$$restProps.class || ''} ${theme}`} style={$$restProps.style || ''}>
    <input {id} type="checkbox" bind:checked={value} />
    <label for={id}>{label}</label>
</div>

<style lang="scss">
    @import "$lib/styles/themes.scss";

    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
    }

    input {
        -webkit-appearance: none;
        appearance: none;
        background: none;

        margin: 0;

        width: 1.2rem;
        height: 1.2rem;
        border: 0.1rem solid black;
        border-radius: 0.25rem;

        display: grid;
        place-content: center;
    }
    input::before {
        content: "";
        width: 0.8rem;
        height: 0.8rem;
        transform: scale(0);
        transition: transform 120ms ease-in-out;
        border-radius: 0.125rem;

        transform-origin: bottom left;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }
    input:checked::before {
        transform: scale(1);
    }
    .primary {
        background: none;
        color: $black;
        
        input::before {
            box-shadow: inset 1rem 1rem $primary;
        }
    }
    .secondary {
        background: none;
        color: $black;
        
        input::before {
            box-shadow: inset 1rem 1rem $secondary;
        }
    }
    .light {
        background: none;
        color: $black;
        
        input::before {
            box-shadow: inset 1rem 1rem $light;
        }
    }
    .dark {
        background: none;
        color: $black;
        
        input::before {
            box-shadow: inset 1rem 1rem $dark;
        }
    }
    .danger {
        background: none;
        color: $black;
        
        input::before {
            box-shadow: inset 1rem 1rem $danger;
        }
    }
</style>