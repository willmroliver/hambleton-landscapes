<script lang="ts">
	import { onDestroy, onMount } from "svelte"

    import { browser } from "$app/environment"
    import { GalleryRepo, Gallery } from "$lib/repos/galleries"

    import Image from "$lib/components/images/Image.svelte"
	import ImageCarousel from "$lib/components/images/ImageCarousel.svelte"
	import Icon from "$lib/components/general/Icon.svelte"
	import TextInput from "$lib/components/inputs/TextInput.svelte"
	import TextArea from "$lib/components/inputs/TextArea.svelte"
	import Button from "$lib/components/inputs/Button.svelte"
    import Modal from "$lib/components/general/Modal.svelte"

    const galleryRepo = new GalleryRepo()
    let galleries: Gallery[] = []

    const email = {
        mobile: '',
        subject: '',
        body: '',
    }

    let src: string = ''

    let renderById: any = galleries.reduce((prev, curr) => {
        prev[curr.id!] = false
        return prev
    }, {} as any)
    
    const renderImages = (main: HTMLElement) => {
        let section: HTMLElement
        let rect: DOMRect

        galleries.forEach(g => {
            section = document.getElementById(g.title)!
            rect = section.getBoundingClientRect()

            renderById[g.id!] = renderById[g.id!] || rect.top < (main.offsetHeight - 0)
        })
    }

    let ticking = false
    const throttleRenderImages = (event: Event) => {
        if (ticking) return
        ticking = true

        window.setTimeout(() => {
            renderImages(event.target as HTMLElement)
            ticking = false
        }, 100)
    }

    onMount(async () => {
        try {
            let _galleries = await galleryRepo.list()
            for (const g of _galleries) await g.loadImages()
            galleries = _galleries

            document.getElementById('main')!.addEventListener('scroll', throttleRenderImages)
        } catch (err) {
            console.error('failed to fetch galleries:', err)
        }
    })

    onDestroy(() => {
        if (browser) document.getElementById('main')!.removeEventListener('scroll', throttleRenderImages)
    })

    $: services = [
        ...galleries.map(g => ({ 
            name: g.title, 
            to: g.title, 
            link: g.images.length || g.body,
            gallery: g,
        })),
    ]

    $: formAction = `mailto:hambletonlandscapes@gmail.com?subject=${email.subject}`
</script>

<div id="home">
    <div id="contact-details">
        <a href="mailto:hambletonlandscapes@gmail.com"><Icon name="envelope" size="lg" append="start" />hambletonlandscapes@gmail.com</a>
        <a href="tel:+447935132800"><Icon name="phone" size="lg" append="start" />+447935132800</a>
    </div>
    <Image 
        src="logo-primary.svg" 
        alt="logo" 
        height={300} 
        fit="contain"
    />
</div>

<section class="dark">
    <h2>Bespoke Landscaping Services</h2>
    <p>
        With a combined experience of more than 50 years, we bring new life to gardens across North Yorkshire.
        From plant to patio, in city gardens or open acres, we offer a service you can trust to deliver.
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
                <span><Icon name="phone" size="lg" append="start" margin="1rem" />+447935132800</span>
    
                <span><Icon name="envelope" size="lg" append="start" margin="1rem" />Or, send an email below</span>
                <TextInput label="Subject *" bind:value={email.subject} form="form-contact-us" />
                <TextArea label="Message" bind:value={email.body} form="form-contact-us" name="body" />
                <Button theme="secondary" form="form-contact-us" type="submit">
                    Send<Icon name="paper-plane" append="end"/>
                </Button>
            </form>
        </div>

        <div class="services">
            <h3>Our Services</h3>
            {#each services as service}
                <a href={`#${service.to}`} class="service">
                    <Icon name="check" append="start" margin="1rem"/>{ service.name }
                    {#if service.link}
                        <Button 
                            theme="secondary" 
                            style="margin-left: auto; font-size: 0.9rem" 
                        >
                            See more<Icon name="arrow-right" append="end"/>
                        </Button>
                    {/if}
                </a>
            {/each}
        </div>
    </div>
</section>

{#each galleries.filter(g => g.images.length || g.body ) as gallery, i}
    <section id={gallery.title} class={`gallery ${i % 2 ? 'background' : 'white'}`}>
        <h2>{ gallery.title }</h2>
        
        <ImageCarousel 
            urls={gallery.images.map(image => image.url)} 
            height={300}
            render={renderById[gallery.id || '']}
            on:select={(event) => src = event.detail}
        />

        {#if gallery.body}
            <p>{ gallery.body }</p>
        {/if}
    </section>
{/each}

<Modal open={!!src} on:close={() => src = ''}>
    <Image 
        {src} 
        fit="contain"
        on:click={() => src = ''}
    />
</Modal>

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

            background-color: $white;
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
        gap: 3rem;

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
        padding: 3rem 2rem;

        h2 {
            font-size: 2.5rem;
        }
        h3 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }
        p {
            font-size: 1.2rem;
            margin: 1rem 0;
        }
    }

    .services {
        width: 100%;

        .service {
            font-size: 1.4rem;
            text-wrap: nowrap;

            display: flex;
            align-items: center;

            min-width: 100%;
            margin: 0 0 2rem;
        }
        .service:last-of-type {
            margin: 0;
        }
    }
    

    .gallery {
        p {
            padding: 1px 0 1px 1rem;
            border-left: 1px solid $dark;   

            white-space: pre-wrap;
        }
        h2 {
            margin-bottom: 1rem;
        }

        :global(img) {
            border-radius: 0.25rem;
            box-shadow: 5px 5px 1px 0 rgba(0,0,0,0.2);
        }
    }

    @include md {
        section {
            padding: 3rem calc(50% - 22em);
        }
        .contact-services-row {
            flex-direction: row;

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