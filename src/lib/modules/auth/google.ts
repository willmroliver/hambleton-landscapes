import { 
    GoogleAuthProvider, 
    signInWithRedirect, 
    getRedirectResult, 
    onAuthStateChanged,
} from "firebase/auth"

import { auth } from "$lib/firebase/app"
import session from "$lib/stores/session"
import HTTP from "$lib/services/http"

const provider = new GoogleAuthProvider()
const http = new HTTP()

onAuthStateChanged(auth, async (user) => {
    if (!user) return

    const idToken = await auth.currentUser!.getIdToken(true)

    const res = await http.post('/auth', {
        token: idToken,
    })

    if (res.status !== 200) return false

    session.set({
        ...res.body.user,
        uid: user.uid,
        idToken,
        loggedIn: true,
    })

    await user.getIdToken(true)
    return true
})

async function signIn() {
    try {
        await signInWithRedirect(auth, provider)
    } catch (err) {
        console.error(err)
    }
}

async function getResult(): Promise<boolean> {
    try {
        const redirectRes = await getRedirectResult(auth)
        if (!redirectRes) return false

        const credential = GoogleAuthProvider.credentialFromResult(redirectRes)

        session.set({ accessToken: credential?.accessToken })

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