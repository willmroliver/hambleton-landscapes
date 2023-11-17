import { getDownloadURL } from "firebase/storage"
import { Image } from "$lib/repos/images"
import { 
    list as _list, 
    upload as _upload,
    remove as _remove,
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

const upload = async (file: File, ...pathSegments: string[]): Promise<Image> => {
    const res = await _upload(file, ...pathSegments)
    const url = await getDownloadURL(res.ref)
    return new Image('', res.ref.name, url, res.ref.fullPath)
} 

const remove = async (path: string) => {
    return await _remove(path)
}

export {
    list,
    upload,
    remove,
}