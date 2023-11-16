<script lang="ts">
    import { createEventDispatcher, onMount, tick } from "svelte"

    export let id: string
    export let height: string|number
    export let open: boolean = true

    const dispatch = createEventDispatcher()

    let svg: HTMLElement

    onMount(async () => {
        svg = document.getElementById(id)!
    })
</script>

<svg 
    {id}
    {height}
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 150 150" 
    shape-rendering="geometricPrecision" 
    text-rendering="geometricPrecision"
    tabindex="0"
    role="button"
    aria-label="Toggle Navigation Bar Visibility"
    class={`${open ? 'close' : 'open'}`}
    on:click|stopPropagation={() => open = !open}
    on:keyup={() => open = !open}
>
    <g id="menu-icon-u-bottom-bar_to">
        <g id="menu-icon-u-bottom-bar_tr">
            <line id="menu-icon-u-bottom-bar" x1="-50" y1="0" x2="70" y2="0" transform="translate(49.999996,0)" opacity="0.4" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        </g>
    </g>
    <g id="menu-icon-u-centre-bar_tr" transform="translate(75.000037,75) rotate(0)">
        <line id="menu-icon-u-centre-bar" x1="-50" y1="0" x2="70" y2="0" transform="translate(-10,0)" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
    </g>
    <g id="menu-icon-u-top-bar_to">
        <g id="menu-icon-u-top-bar_tr">
            <line id="menu-icon-u-top-bar" x1="-50" y1="0" x2="70" y2="0" transform="translate(-70,0)" opacity="0.4" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        </g>
    </g>
</svg>

<style lang="scss">
    @import "$lib/styles/animation.scss";

    svg:focus {
        outline: none;
    }
    
    g, line {
        transition: all $navbar-ms ease;
    }

    .open {
        #menu-icon-u-bottom-bar_to {
            transform: translate(15.000004px, 120px);
        }
        #menu-icon-u-bottom-bar_tr {
            transform: rotate(0deg);
        }
        #menu-icon-u-centre-bar_tr {
            transform: translate(75.000037px,75px) rotate(0deg);
        } 
        #menu-icon-u-centre-bar {
            opacity: 0.4
        }
        #menu-icon-u-top-bar_to {
            transform: translate(135px,30px)
        }
        #menu-icon-u-top-bar_tr {
            transform: rotate(0deg)
        }
    }

    .close {
        #menu-icon-u-bottom-bar_to { 
            transform: translate(32.573596px,117.426404px);
        }
        #menu-icon-u-bottom-bar_tr {
            transform: rotate(-45deg);
        }
        #menu-icon-u-centre-bar_tr {
            transform: translate(75.000037px,75px) rotate(-45deg);
        }
        #menu-icon-u-centre-bar {
            opacity: 0;
        }
        #menu-icon-u-top-bar_to {
            transform: translate(32.573593px,32.573593px);
        }
        #menu-icon-u-top-bar_tr {
            transform: rotate(-135deg)
        }
    }
</style>