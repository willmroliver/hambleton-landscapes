<script lang="ts">
    import Image from "$lib/components/general/Image.svelte"
</script>

<Image src="logo-primary.svg" alt="logo" height={300} fit="fill" style="padding: 1rem 0;" />

<div class="primary">
    <h2>Bespoke Landscaping Services</h2>
    <p>
        With a combined experience of more than 50 years, we bring new life to gardens across North Yorkshire.
        From plant to patio, in city gardens and open acres, we offer a service you can trust to deliver.
    </p>
</div>

<div class="light">
    <h2>A Team You Can Trust</h2>
</div>

<style lang="scss">
    @import "$lib/styles/breakpoints.scss";
    @import "$lib/styles/themes.scss";

    div {
        width: 100%;
        min-height: 50vh;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        align-items: left;

        h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        p {
            text-align: justify;
            max-width: 40rem;
        }
    }

    @include md {
        div {
            align-items: center;
        }
    }
</style>