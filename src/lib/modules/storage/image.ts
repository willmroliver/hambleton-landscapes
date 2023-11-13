import { getDownloadURL } from "firebase/storage"
import { list as _list, ref } from "./storage"

const list = async (path: string, from: string|undefined = undefined) => {
    const { items, next } = await _list(path, from)

    const urls: string[] = []

    for (const item of items) {
        const imageRef = ref(item.fullPath)
        urls.push(await getDownloadURL(imageRef)) 
    }

    return {
        urls,
        next,
    }
} 

export {
    list,
}