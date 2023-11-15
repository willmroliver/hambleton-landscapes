import { db } from "$lib/firebase/app"
import { collection, doc, addDoc, setDoc, getDoc, getDocs } from "firebase/firestore"

const write = async (data: any, path: string, ...pathSegments: string[]) => {
    return await addDoc(collection(db, path, ...pathSegments), data)
}

const update = async (id: string, data: any, path: string, ...pathSegments: string[]) => {
    return await setDoc(doc(collection(db, path, ...pathSegments), id), data)
}

const get = async (id: string, path: string, ...pathSegments: string[]) => {
    return await getDoc(doc(collection(db, path, ...pathSegments), id))
}

const list = async (path: string, ...pathSegments: string[]) => {
    return await getDocs(collection(db, path, ...pathSegments))
}

export default {
    write,
    update,
    get,
    list,
}