import { writable } from "svelte/store"

const store = () => {
    const state = {
        email: '',
        displayName: '',
        accessToken: '',
        uid: '',
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