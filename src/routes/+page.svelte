<script lang="ts">
    import Button from "$lib/components/inputs/Button.svelte"
	import Checkbox from "$lib/components/inputs/Checkbox.svelte"
	import TextArea from "$lib/components/inputs/TextArea.svelte"
    import TextInput from "$lib/components/inputs/TextInput.svelte"
    
    import Image from "$lib/components/general/Image.svelte"
    import ImageUpload from "$lib/components/inputs/ImageUpload.svelte"
</script>

<Image src="logo-primary.svg" alt="logo" height={300} fit="contain" />
<h2>York, North Yorkshire</h2>

<ImageUpload class="upload" theme="light" />

<div>
    <Button theme="primary" on:click={() => {console.log('Primary')}}>Primary</Button>
    <Button theme="secondary">Secondary</Button>
    <Button theme="light">Light</Button>
    <Button theme="dark">Dark</Button>
    <Button theme="danger">Danger</Button>
</div>

<div class="form">
    <TextInput label="Label One" class="in vw-50" />
    <TextInput label="Label Two" class="in vw-50" />
    <Checkbox label="Primary" class="in" />
    <Checkbox label="Danger" theme="danger" class="in" />

    <TextArea label="Label" class="in" style="width: 50vw;" placeholder="Placeholder" />
</div>

<style lang="scss">
    @import "$lib/styles/colors.scss";

    :global(.upload) {
        padding: 0.5rem;
        margin-bottom: 1rem;

        background-color: $light;
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    div {
        margin-bottom: 1rem;
    }

    .form :global(.vw-50) {
        width: 50vw;
    }
    .form :global(.in) {
        margin-bottom: 1rem;
    }
</style>