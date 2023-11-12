import { initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const app = initializeApp()

const auth = getAuth()
const db = getFirestore()

export {
    app,
    auth,
    db,
}