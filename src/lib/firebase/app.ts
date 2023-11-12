import "firebase/firestore";

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage, ref } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyC9AHaHcT0oanlzwhvcwt5m6nI6XKuJ3ko",
    authDomain: "hambleton-landscapes.web.app",
    projectId: "hambleton-landscapes",
    storageBucket: "hambleton-landscapes.appspot.com",
    messagingSenderId: "786642997466",
    appId: "1:786642997466:web:1883c4f31caad63789d5e3",
    measurementId: "G-80GJ93X45P"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const storage = getStorage(app)
const db = getFirestore(app)

auth.useDeviceLanguage()

const storageRef = (path: string) => {
    return ref(storage, path)
}

export {
    app,
    auth,
    storage,
    storageRef,
    db,
}