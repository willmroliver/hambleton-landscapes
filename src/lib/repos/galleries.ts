import Repo from "./repo";
import { Image, ImageRepo } from "./images";
import { upload, remove as storageRemove } from "$lib/modules/storage/image"


class Gallery {
    id: string|undefined
    title: string
    body: string
    images: Image[]
    imageRepo: ImageRepo

    private imagesLoaded: boolean = false

    public constructor(id: string, title: string, body: string = '', images: Image[] = []) {
        this.id = id
        this.title = title
        this.body = body
        this.images = images

        this.imageRepo = new ImageRepo(id)
    }

    public async uploadImage(f: File|Blob|null) {
        if (!f || !this.id) return

        // So that we set correct positions in the image meta.
        if (!this.imagesLoaded) await this.loadImages()

        const image = await upload(f as File, 'admin', 'galleries', this.id)
        
        image.meta.position = this.images.length
        const result = await this.imageRepo.create(image)
        
        image.id = result.id
        this.images.push(image)
        
        return image
    }

    public async removeImage(id: string) {
        const index = this.images.findIndex(i => i.id === id)
        if (index === -1) return

        const image = this.images.splice(index, 1)[0]

        await storageRemove(image.path)
        await this.imageRepo.remove(image)

        for (let i = 0; i < this.images.length; ++i) {
            this.images[i].meta.position = i
            this.imageRepo.update(this.images[i])
        }
    }

    public async loadImages() {
        this.images = await this.imageRepo.list()
        this.images.sort((a, b) => a.meta.position > b.meta.position ? 1 : -1)
        
        this.imagesLoaded = true
    }
}

class GalleryRepo {
    private repo = new Repo('admin', 'all', 'galleries')

    public async get(id: string) {
        return this.gallery(await this.repo.get(id))
    }

    public async list() {
        return (await this.repo.list()).map(data => this.gallery(data))
    }

    public async create(gallery: Gallery) {
        const ref = await this.repo.create(this.data(gallery))
        return new Gallery(ref.id, gallery.title, gallery.body)
    }

    public async update(gallery: Gallery) {
        if (!gallery.id) return
        return await this.repo.update(gallery.id, this.data(gallery))
    }

    public async remove(gallery: Gallery) {
        if (!gallery.id) return

        gallery.images.forEach(image => storageRemove(image.path))
        
        return await this.repo.remove(gallery.id)
    }

    private data(gallery: Gallery) {
        return {
            title: gallery.title,
            body: gallery.body,
        }
    }

    private gallery(data: any) {
        return new Gallery(data.id, data.title, data.body, [])
    }
}

export {
    Gallery,
    GalleryRepo,
}