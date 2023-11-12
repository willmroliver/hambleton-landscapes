import { storage, storageRef } from "$lib/firebase/app";
import { uploadBytes } from "firebase/storage";

const upload = async (path: string, file: File) => {
    const fullPath = `${path}/${file.name}`
    const ref = storageRef(fullPath)

    const snapshot = await uploadBytes(ref, file)

    return snapshot
}

export {
    upload,
}