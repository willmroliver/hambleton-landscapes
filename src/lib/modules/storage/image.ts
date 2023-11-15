import { getDownloadURL } from "firebase/storage"
import { Image } from "$lib/repos/images"
import { 
    list as _list, 
    upload as _upload,
    ref,  
} from "./storage"

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

const upload = async (path: string, file: File): Promise<Image> => {
    const res = await _upload(path, file)
    const url = await getDownloadURL(res.ref)
    return new Image(res.ref.name, url, res.ref.fullPath)
} 

export {
    list,
    upload,
}