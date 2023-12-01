<script lang="ts">
	import { onMount } from "svelte";
    import UUID from "$lib/modules/utils/uuid";

    export let open: boolean = false
    export let blocking: boolean = false
    const id: string = new UUID().id
    
    onMount(() => {
        const modalDiv = document.getElementById(id)!
        const teleportDiv = document.getElementById('teleport')!

        teleportDiv.appendChild(modalDiv)
    })

    $: modalClass = `modal-bg ${open ? 'modal-show' : 'modal-hide'}`
</script>

<div
    {id}
    class={modalClass}
    on:click={() => open = blocking ? open : false }
    on:keyup={() => open = blocking ? open : false }
    role="button"
    tabindex={0}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-wrapper" on:click|stopPropagation>
        <div class="modal-content">
            <slot />
        </div>
    </div>
</div>

<style global lang="scss">
    @import "$lib/styles/breakpoints.scss";
    @import "$lib/styles/colors.scss";

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
            max-width: calc(100% - 2rem);
            box-shadow: 0 0 500px 1000px rgba(0,0,0,0.5);
            animation: appear 300ms 1 ease;
            border-radius: 0.5rem;

            @keyframes appear {
                0% { opacity: 0 }
                100% { opacity: 1}
            }

            .modal-content {
                width: 100%;
                height: 100%;
                background-color: $white;
                border-radius: 0.5rem;
                display: flex;
                flex-direction: column;

                gap: 0.5rem;
                padding: 0.5rem;

                :global(img) {
                    max-width: 90%;
                }

                @include md {
                    gap: 1rem;
                    padding: 1rem;
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