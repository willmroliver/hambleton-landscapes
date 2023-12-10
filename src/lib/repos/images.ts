import Repo from "./repo";
import { remove as storageRemove } from "$lib/modules/storage/image"

class Image {
    id: string|undefined
    path: string
    url: string
    meta: any

    public constructor(id: string|undefined, url: string, path: string, meta: any = {}) {
        this.id = id
        this.url = url
        this.path = path
        this.meta = meta
    }
}

class ImageRepo {
    private repo: Repo

    public constructor(galleryId: string) {
        this.repo = new Repo('admin', 'all', 'galleries', galleryId, 'images')
    }

    public async get(id: string) {
        return this.image(await this.repo.get(id))
    }

    public async list() {
        return (await this.repo.list()).map(data => this.image(data))
    }

    public async create(image: Image) {
        return await this.repo.create(this.data(image))
    }

    public async update(image: Image) {
        if (!image.id) return
        return await this.repo.update(image.id, this.data(image))
    }

    public async remove(image: Image) {
        if (!image.id) return

        return await Promise.all([
            this.repo.remove(image.id), 
            storageRemove(image.path)
        ])
    }

    private data(image: Image) {
        const _data = {
            url: image.url,
            path: image.path,
            meta: image.meta
        }

        return  _data
    }

    private image(data: any) {
        return new Image(
            data.id, 
            data.url,
            data.path, 
            data.meta, 
        )
    }
}

export {
    Image,
    ImageRepo,
}