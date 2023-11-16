import { 
    GoogleAuthProvider, 
    signInWithRedirect, 
    onAuthStateChanged,
} from "firebase/auth"

import { auth } from "$lib/firebase/app"
import session from "$lib/stores/session"
import UserRepo from "$lib/repos/users"

const provider = new GoogleAuthProvider()
const userRepo = new UserRepo()

onAuthStateChanged(auth, async (user) => {
    if (!user) return

    const idToken = await user.getIdToken()
    const userData = await userRepo.get(user.uid)

    session.set({
        ...userData,
        uid: user.uid,
        idToken,
        loggedIn: true,
    })

    return true
})

async function signIn() {
    try {
        await signInWithRedirect(auth, provider)
    } catch (err) {
        console.error(err)
    }
}

export {
    signIn,
}