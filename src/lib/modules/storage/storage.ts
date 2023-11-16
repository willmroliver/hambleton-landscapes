import { storage } from "$lib/firebase/app"
import { 
    uploadBytes,
    ref as _ref, 
    list as _list,
    deleteObject,
} from "firebase/storage"

const ref = (path: string) => {
    return _ref(storage, path)
}

const upload = async (path: string, file: File) => {
    const fullPath = `${path}/${file.name}`
    const uploadRef = ref(fullPath)

    const snapshot = await uploadBytes(uploadRef, file)

    return snapshot
}

const list = async (path: string, from: string|undefined = undefined) => {
    const listRef = ref(path)

    const page = await _list(listRef, { maxResults: 100, pageToken: from })

    return {
        items: page.items,
        next: page.nextPageToken,
    }
}

const remove = async (name: string, path: string) => {
    const fullPath = `${path}/${name}`
    const removeRef = ref(fullPath)

    return await deleteObject(removeRef)
}

export {
    upload,
    list,
    remove,
    ref,
}