import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { auth } from "$lib/services/firebase/app"
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

async function getResult() {
    try {
        const res = await getRedirectResult(auth)
        if (!res) return

        const user = res.user
        const credential = GoogleAuthProvider.credentialFromResult(res)
        const token = credential!.accessToken

        const doc = await userRepo.get(user.uid)

        session.set({
            ...user,
            admin: doc.admin,
            credential,
            token,
        })
    } catch (err) {
        console.error(err)
    }
}

export {
    signIn,
    getResult,
}