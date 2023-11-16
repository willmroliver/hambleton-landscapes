<script lang="ts">
    import Image from "$lib/components/images/Image.svelte"
	import { onMount } from "svelte"
    import { GalleryRepo, Gallery } from "$lib/repos/galleries"
	import ImageCarousel from "$lib/components/images/ImageCarousel.svelte"
	import Icon from "$lib/components/general/Icon.svelte"
	import TextInput from "$lib/components/inputs/TextInput.svelte"
	import TextArea from "$lib/components/inputs/TextArea.svelte"
	import Button from "$lib/components/inputs/Button.svelte";

    const galleryRepo = new GalleryRepo()
    let galleries: Gallery[] = []

    const email = {
        mobile: '',
        subject: '',
        body: '',
    }

    onMount(async () => {
        try {
            let _galleries = await galleryRepo.list()
            for (const g of _galleries) await g.loadImages()
            galleries = _galleries
        } catch (err) {
            console.error('failed to fetch galleries:', err)
        }
    })

    $: services = [
        ...galleries.map(g => ({ name: g.title, to: g.title, link: g.images.length || g.body })),
    ]

    $: formAction = `mailto:hambletonlandscapes@gmail.com?subject=${email.subject}`
</script>

<div id="home">
    <div id="contact-details">
        <a href="mailto:hambletonlandscapes@gmail.com"><Icon name="envelope" size="lg" style="margin-right: 0.5rem" />hambletonlandscapes@gmail.com</a>
        <span><Icon name="phone" size="lg" style="margin-right: 0.5rem" />+447935132800</span>
    </div>
    <Image 
        src="logo-primary.svg" 
        alt="logo" 
        height={300} 
        fit="contain"
    />
</div>

<section class="primary">
    <h2>Bespoke Landscaping Services</h2>
    <p>
        With a combined experience of more than 50 years, we bring new life to gardens across North Yorkshire.
        From plant to patio, in city gardens and open acres, we offer a service you can trust to deliver.
    </p>

    <div id="contact-us" class="contact-services-row">
        <div class="contact">
            <h3>Contact Us</h3>
            <form
                id="form-contact-us" 
                action={formAction} 
                method="post" 
                enctype="text/plain"
            >
                <span><Icon name="phone" size="lg" style="margin-right: 1rem" />+447935132800</span>
    
                <span><Icon name="envelope" size="lg" style="margin-right: 1rem" />Or, send an email below</span>
                <TextInput label="Subject *" bind:value={email.subject} form="form-contact-us" />
                <TextArea label="Message" bind:value={email.body} form="form-contact-us" name="body" />
                <Button theme="secondary" form="form-contact-us" type="submit">
                    Open Mail<Icon name="paper-plane" style="margin-left: 0.5rem"/>
                </Button>
            </form>
        </div>
        <div class="services">
            <h3>Our Services</h3>
            {#each services as service}
                <a href={`#${service.to}`} class="service">
                    <Icon name="check" style="margin-right: 2rem"/>{ service.name }
                    {#if service.link}
                         <span style="font-size: 0.95rem;">- Click to see <Icon name="arrow-right" style="margin-left: 0.5rem" /></span>
                    {/if}
                </a>
            {/each}
        </div>
    </div>
</section>

{#each galleries.filter(g => g.images.length || g.body ) as gallery, i}
    <section id={gallery.title} class={i % 2 ? 'light' : 'none'}>
        <h2>{ gallery.title }</h2>
        
        <span>
            <ImageCarousel urls={gallery.images.map(image => image.url)} height={200} />
        </span>
        

        {#if gallery.body}
            <p>{ gallery.body }</p>
        {/if}
    </section>
{/each}

<style lang="scss">
    @import "$lib/styles/breakpoints.scss";
    @import "$lib/styles/themes.scss";

    #home {
        position: sticky;
        z-index: -1;
        top: 0;

        display: flex;
        flex-direction: column;
        justify-content: center;

        width: 100%;
        min-height: 75vh;

        #contact-details {
            position: absolute;
            top: 1.25rem;
            left: 1.25rem;

            display: flex;
            flex-direction: column;
            gap: 1rem;

            width: fit-content;
            text-wrap: nowrap;
        }
       
    }

    #contact-us {
        margin: 2rem 0;
        form {
            display: flex;
            flex-direction: column;
            gap: 2rem;

            background-color: $background;
            color: $black;
            padding: 1.25rem 1rem 1rem;
            border-radius: 0.25rem;

            span {
                width: 100%;
            }
        }
    }
    
    .contact-services-row {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 2rem;

        .contact {
            width: 100%;
        }
        .services {
            display: flex;
            flex-direction: column;
        }
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: left;

        width: 100%;
        padding: 1rem 2rem;

        h2 {
            font-size: 3rem;
        }
        h3 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
        }
        p {
        font-size: 1.2rem;
            margin: 1rem 0;   
        }
    }
    section > * {
        width: clamp(200px, 100%, 40rem);
    }

    .service {
        font-size: 1.4rem;
        text-wrap: nowrap;

        margin: 0 0 2rem;
    }

    @include md {
        section {
            align-items: center;
        }
        .contact-services-row {
            flex-direction: row;
            gap: 2rem;

            .contact, .service {
                flex-grow: 1;
            }
        }
        #contact-details {
            align-items: center;
            left: 50% !important;
            font-size: 1.2rem;
            transform: translateX(-50%);
        }
    }
</style>