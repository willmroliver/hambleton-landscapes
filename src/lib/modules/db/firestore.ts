import { db } from "$lib/firebase/app"
import { collection, doc, addDoc, setDoc, getDoc, getDocs } from "firebase/firestore"

const write = async (to: string, data: any) => {
    return await addDoc(collection(db, to), data)
}

const update = async (to: string, id: string, data: any) => {
    return await setDoc(doc(collection(db, to), id), data)
}

const get = async (from: string, id: string) => {
    return await getDoc(doc(collection(db, from), id))
}

const list = async (from: string) => {
    return await getDocs(collection(db, from))
}

export default {
    write,
    update,
    get,
    list,
}