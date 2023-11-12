<script lang="ts">
    import ImageUpload from "$lib/components/inputs/ImageUpload.svelte"
    import session from "$lib/stores/session"
    import { upload } from "$lib/modules/storage/cloud"

    let success = false

    const saveImage = async (file: File|Blob|null) => {
        try {
            if (!file || !$session.uid) return
            const res = await upload('admin/images', file as File)

            console.log(res)
            success = true
        } catch (err) {
            console.error(err)
        }
    }
</script>

<ImageUpload theme="secondary" height={300} {saveImage} class="upload" />

{#if success}
<div>
    Your image has been saved to the cloud.
</div>
{/if}

<style lang="scss">
    :global(.upload) {
        margin-top: 2rem;
    }

    div {
        margin-top: 2rem;
    }
</style>