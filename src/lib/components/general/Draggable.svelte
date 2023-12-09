<script lang="ts">
	import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()

    export let data: any
    
    const drag = () => {
        dispatch('drag', data)
    }

    const over = () => {
        dispatch('over', data)
    }

    const drop = () => {
        dispatch('drop', data)
    }
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    draggable={true}
    on:dragstart={drag}
    on:dragover|preventDefault={over}
    on:dragleave|preventDefault
    on:drop|preventDefault={drop} 
>
    <slot />
</div>