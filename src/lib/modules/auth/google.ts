import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth"
import { auth } from "$lib/firebase/app"
import session from "$lib/stores/session"
import HTTP from "$lib/services/http"

const provider = new GoogleAuthProvider()
const http = new HTTP()

async function signIn() {
    try {
        await signInWithRedirect(auth, provider)
    } catch (err) {
        console.error(err)
    }
}

async function getResult(): Promise<boolean> {
    try {
        let res: any = await getRedirectResult(auth)
        if (!res) return false

        const user = res.user
        const credential = GoogleAuthProvider.credentialFromResult(res)
        const accessToken = credential!.accessToken

        const idToken = await auth.currentUser!.getIdToken(true)

        res = await http.post('/auth', {
            token: idToken,
        })

        if (res.status !== 200) return false

        session.set({
            ...res.body.user,
            uid: user.uid,
            idToken,
            accessToken,
            loggedIn: true,
        })

        await refreshToken()

        return true
    } catch (err) {
        console.error(err)
    }

    return false;
}

async function refreshToken() {
    await auth.currentUser!.getIdToken(true)
}

export {
    signIn,
    getResult,
    refreshToken,
}