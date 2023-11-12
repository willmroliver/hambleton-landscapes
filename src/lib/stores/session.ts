import { writable } from "svelte/store"

const store = () => {
    const state = {
        email: '',
        displayName: '',
        uid: '',
        idToken: '',
        accessToken: '',
        admin: false,
        loggedIn: false,
    }

    const { subscribe, update } = writable(state);

    const set = (values: object) => {
        update(previous => ({...previous, ...values}))
    }

    return {
        subscribe,
        set,
    }
}

export default store()