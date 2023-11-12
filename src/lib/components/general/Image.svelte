<script lang="ts">
    export let fit: string = 'cover';
    export let height: string|number;
</script>

<div class={$$restProps.class || ''} style={$$restProps.style || ''}>
    <img 
        src={$$restProps.src} 
        alt={$$restProps.alt} 
        class={`${fit}`}
        {height}
    />
</div>

<style>
    .fill {
        object-fit: fill;
    }
    .contain {
        object-fit: contain;
    }
    .cover {
        object-fit: cover;
    }

    img {
        max-width: 100vw;
    }
</style>