<script lang="ts">
	import { createEventDispatcher, onMount, tick } from "svelte"
    import UUID from "$lib/modules/utils/uuid"
	import Icon from "./Icon.svelte";

    export let open: boolean = false
    export let blocking: boolean = false
    const id: string = new UUID().id

    const dispatch = createEventDispatcher()
    
    onMount(() => {
        const modalDiv = document.getElementById(id)!
        const teleportDiv = document.getElementById('teleport')!

        teleportDiv.appendChild(modalDiv)
    })

    const close = async () => {
        if (blocking) return

        open = false
        dispatch('close')
    }

    $: modalClass = `modal-bg ${open ? 'modal-show' : 'modal-hide'}`
</script>

<div
    {id}
    class={modalClass}
    on:click={close}
    on:keyup={close}
    role="button"
    tabindex={0}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-wrapper" on:click|stopPropagation>
        <div class="modal-content">
            <slot />
        </div>

        {#if !blocking}
            <div class="modal-x dark" on:click={close}>
                <Icon name="x" />
            </div>
        {/if}
    </div>
</div>

<style global lang="scss">
    @import "$lib/styles/breakpoints.scss";
    @import "$lib/styles/themes.scss";

    .modal-bg {
        position: absolute;
        top: 0;
        left: 0;

        z-index: 100;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        transition: opacity 300ms ease;

        .modal-wrapper {
            position: relative;

            max-width: calc(100% - 2rem);
            max-height: calc(100% - 2rem);

            box-shadow: 0 0 500px 1000px rgba(0,0,0,0.5);
            animation: appear 300ms 1 ease;
            border-radius: 0.5rem;

            @keyframes appear {
                0% { opacity: 0 }
                100% { opacity: 1 }
            }

            .modal-content {
                background-color: $white;
                border-radius: 0.5rem;
                display: flex;
                flex-direction: column;

                max-width: 100%;
                max-height: 100%;
                overflow: hidden;
                overflow-y: auto;

                gap: 0.5rem;
                padding: 0.5rem;
            }

            .modal-x {
                position: absolute;
                top: 0;
                right: 0;

                padding: 0.75rem;
                border-radius: 0 0.5rem 0 0.5rem;

                border: 0.2rem solid $white;

                :global(i) {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
            
    .modal-show {
        opacity: 1;
        z-index: 100;
    }
    
    .modal-hide {
        opacity: 0;
        pointer-events: none;
        touch-action: none;
        -ms-touch-action: none;
    }
</style>