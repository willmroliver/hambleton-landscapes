<script lang="ts">
    import session from "$lib/stores/session"
    import UUID from "$lib/modules/utils/uuid"
    import { signIn, getResult } from "$lib/modules/auth/google"

	import { onMount } from "svelte"
    import { goto } from "$app/navigation";

    const navId = new UUID().id
    const toggleId = new UUID().id;

    let showNav = false
    let layout: HTMLElement
    let toggle: HTMLElement

    const toggleNav = () => {
        showNav = !showNav

        if (showNav) {
            layout.classList.remove('hide-nav')
        } else {
            layout.classList.add('hide-nav')
        }
    }

    const navTo = (item: any) => {
        if (item.cb) item.cb()
        else goto(item.goto)

        toggleNav()
    }

    onMount(() => {
        layout = document.getElementById(navId)!
        toggle = document.getElementById(toggleId)!

        getResult()
    })

    const navItems: Array<any> = [
        { name: 'Home', goto: '/' },
        { name: 'About', goto: '/' },
        { name: 'Login', cb: signIn },
    ]
</script>

<div id={navId} class="layout hide-nav">
    <div class="nav">
        <div 
            id={toggleId} 
            class="toggle" 
            on:click={toggleNav}
            on:keyup={toggleNav}
            tabindex="0"
            role="button"
            aria-label="Toggle Navigation Bar Visibility"
        />
        {#each navItems as item}
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
        {/each}
    </div>

    <div class="main">
        {#if $session.uid}
        <div class="profile light">
            <span>Hello, {$session.displayName.split(' ')[0]}</span>
        </div>
        {/if}

        <slot />
    </div>
</div>

<style global lang="scss">
    @import "$lib/styles/colors.scss";
    @import "$lib/styles/themes.scss";

    :global(html) {
        background-color: $background;
    }

    .layout {
        width: 100vw;
        max-width: 100vw;

        height: 100vh;
        max-height: 100vh;

        display: grid;
        position: relative;

        color: $primary;
        font-family: 'Quicksand', sans-serif;

        transition: all 200ms ease;

        .main {            
            grid-area: main;
            display: flex;
            flex-direction: column;
            align-items: center;

            overflow: hidden;
            overflow-y: auto;

            .profile {
                border-radius: 0.25rem;
                padding: 0.5rem;
                margin-left: auto;
                
                font-size: 1.2rem;
                
                span {
                    margin-bottom: 0.5rem;
                }
                span:last-child {
                    margin-bottom: 0;
                }
            }

            :global(h1), :global(h2), :global(h3), :global(h4), :global(h5) {
                font-family: 'Cormorant Upright', serif;
            }
        }
        .nav {
            grid-area: nav;
            display: flex;

            background-color: $dark;

            position: relative;
            
            .toggle {
                position: absolute;

                width: 2rem;
                height: 2rem;
                background-color: $light;

                transition: transform 800ms ease;
                cursor: pointer;
            }

            .nav-item {
                color: $white;
                padding: 0.6rem;
                border: 0.1rem solid $white;
                white-space: nowrap;
                cursor: pointer;

                transition: all 200ms ease;
            }
        }
    }

    @media only screen and (min-width: 701px) {
        .layout {
            grid-template-columns: 10rem auto;
            grid-template-rows: 1;
            grid-template-areas: "nav main";

            .nav {
                flex-direction: column;
                align-items: left;
                justify-content: center;
                
                .nav-item {
                    margin: 0 0.6rem 0.6rem 0.6rem;
                }
                
                .toggle {
                    top: 1rem;
                    right: 0;
                    transform: translateX(75%);
                    border-radius: 0 1rem 1rem 0;
                }
            }
            .main {
                padding: 1rem;
            }
        }
        .hide-nav {
            grid-template-columns: 0 auto;

            .toggle {
                transform: translateX(60%) !important;
            }
            .nav-item {
                pointer-events: none;
                opacity: 0;
            }
        }
    }

    @media only screen and (max-width: 700px) {
        .layout {
            grid-template-rows: 5rem auto;
            grid-template-columns: 1;
            grid-template-areas: "nav" "main";

            .nav {
                flex-direction: row;
                align-items: center;
                justify-content: center;

                .nav-item {
                    margin: 0 0.3rem 0 0.3rem;
                }

                .toggle {
                    top: 100%;
                    right: 1rem;
                    transform: translateY(-25%);
                    border-radius: 0 0 1rem 1rem;
                }
            }
            .main {
                padding: 0.5rem;
                align-items: left;
            }
        }

        .hide-nav {
            grid-template-rows: 0 auto;

            .toggle {
                transform: translateY(-40%) !important;
            }
            .nav-item {
                pointer-events: none;
                opacity: 0;
            }
        }
    }
</style>