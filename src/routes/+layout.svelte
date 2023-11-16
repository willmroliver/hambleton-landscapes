<script lang="ts">
    import NavIcon from "$lib/components/svg/NavIcon.svelte"

    import session from "$lib/stores/session"
    import UUID from "$lib/modules/utils/uuid"
    import { signIn } from "$lib/modules/auth/google"

	import { onMount } from "svelte"
    import { goto } from "$app/navigation"

    onMount(async () => {
        layout = document.getElementById(navId)!
    })

    const navItems: any[] = [
        { name: 'Home', goto: '/', admin: true },
        { name: 'Contact Us', href: 'contact-us' },
        !$session.loggedIn ? ({ name: 'Login', cb: signIn }) : undefined,
        { name: 'Admin', goto: '/admin', admin: true },
    ]

    const navId = new UUID().id
    const toggleId = new UUID().id

    let showNav = false
    let layout: HTMLElement

    const toggleNav = () => {
        showNav = !showNav
        layout.classList[showNav ? 'remove' : 'add']('hide-nav')
    }

    const navTo = (item: any) => {
        if (item.cb) item.cb()
        else goto(item.goto)

        toggleNav()
    }

    $: layoutClass = `layout ${showNav ? '' : 'hide-nav'}`
</script>

<div id={navId} class={layoutClass}>
    <div class="nav">
        <div class="nav-toggle">
            <NavIcon 
                id={toggleId}
                height={48}
                bind:open={showNav}
            />
        </div>
        {#each navItems.filter(item => !item.admin || $session.admin) as item}
            {#if !item.href}
                <div 
                    class="nav-item" 
                    on:click={() => navTo(item)} 
                    on:keyup={() => navTo(item)}
                    tabindex="0"
                    role="button"
                    aria-label={`Navigate to ${item.name}`}
                >
                    {item.name}
                </div>
            {:else} 
                <a class="nav-item" href={`#${item.href}`}>{item.name}</a>
            {/if}
        {/each}
    </div>

    <div class="main">
        <slot />
    </div>
</div>

<style global lang="scss">
    @import "$lib/styles/breakpoints.scss";
    @import "$lib/styles/themes.scss";
    @import "$lib/styles/animation.scss";

    :global(html) {
        background-color: $background;
    }

    .layout {
        width: 100vw;
        max-width: 100vw;

        height: 100vh;
        max-height: 100vh;

        display: grid;
        grid-template-rows: 5rem auto;
        grid-template-columns: 1;
        grid-template-areas: "nav" "main";

        position: relative;
        font-family: 'Quicksand', sans-serif;

        transition: all $navbar-ms ease;

        .main {            
            grid-area: main;
            display: flex;
            flex-direction: column;
            align-items: center;

            overflow: hidden;
            overflow-y: scroll;
            scroll-behavior: smooth;

            padding-bottom: 6rem;

            .profile {
                border-radius: 0.25rem;
                padding: 0.5rem;
                margin: 0.5rem auto 0 0.5rem;
                
                font-size: 1.2rem;
                
                span {
                    margin-bottom: 0.5rem;
                }
                span:last-child {
                    margin-bottom: 0;
                }
            }

            :global(h1), :global(h2), :global(h3), :global(h4), :global(h5) {
                font-family: 'Old Standard TT', serif;
            }
        }
        .nav {
            grid-area: nav;
            position: relative;
            align-items: left;

            display: flex;
            flex-direction: row;
            align-items: center;

            padding-left: 1rem;
            justify-content: left;

            @include sm {
                padding-left: 0;
                justify-content: center;
            }

            box-shadow: 0 0 2rem 0 rgba(0,0,0,0.1);
            
            .nav-toggle {
                position: absolute;
                top: 1rem;
                right: 1rem;
                z-index: 10;

                cursor: pointer;
            }

            .nav-item {
                position: relative;

                padding: 0.6rem;
                white-space: nowrap;
                cursor: pointer;

                transition: all $navbar-ms ease;

                margin: 0 0.3rem 0 0.3rem;
            }
        }
    }
    .hide-nav {
        grid-template-rows: 0 auto;

        .nav-item {
            pointer-events: none;
            opacity: 0;
        }
    }
</style>