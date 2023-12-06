import { storage } from "$lib/firebase/app"
import { 
    uploadBytes,
    ref as _ref, 
    list as _list,
    deleteObject,
    updateMetadata,
} from "firebase/storage"

const ref = (path: string) => {
    return _ref(storage, path)
}

const upload = async (file: File, ...pathSegments: string[]) => {
    pathSegments.push(file.name)
    
    const fullPath = pathSegments.join('/')
    const uploadRef = ref(fullPath)

    const snapshot = await uploadBytes(uploadRef, file)

    updateMetadata(uploadRef, { 
        cacheControl: 'public,max-age=86400' 
    })

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

const remove = async (path: string) => {
    return await deleteObject(ref(path))
}

export {
    upload,
    list,
    remove,
    ref,
}