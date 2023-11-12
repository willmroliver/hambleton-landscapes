import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { auth } from "$lib/firebase/app"
import session from "$lib/stores/session"
import UserRepo from "$lib/repos/users"

const provider = new GoogleAuthProvider()
const userRepo = new UserRepo()

async function signIn() {
    try {
        await signInWithRedirect(auth, provider)
    } catch (err) {
        console.error(err)
    }
}

async function getResult(): Promise<boolean> {
    try {
        const res = await getRedirectResult(auth)
        if (!res) return false

        const user = res.user
        const credential = GoogleAuthProvider.credentialFromResult(res)
        const accessToken = credential!.accessToken

        const idToken = await auth.currentUser?.getIdToken(true)

        session.set({
            ...user,
            idToken,
            accessToken,
        })

        return true
    } catch (err) {
        console.error(err)
    }

    return false;
}

export {
    signIn,
    getResult,
}