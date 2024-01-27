<script lang="ts">
	import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()

    export let data: any
    
    const drag = (event: any) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(data))
        dispatch('drag', data)
    }

    const over = (event: any) => {
        dispatch('over', data)
    }

    const drop = (event: any) => {
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