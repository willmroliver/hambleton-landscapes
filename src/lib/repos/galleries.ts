import Repo from "./repo";
import { Image, ImageRepo } from "./images";
import { upload } from "$lib/modules/storage/image"

class Gallery {
    id: string|undefined
    title: string
    body: string
    images: Image[]
    imageRepo: ImageRepo

    public constructor(id: string, title: string, body: string = '', images: Image[] = []) {
        this.id = id
        this.title = title
        this.body = body
        this.images = images

        this.imageRepo = new ImageRepo(id)
    }

    public async saveImage(f: File|Blob|null) {
        if (!f || !this.title) return

        const image = await upload(f as File, 'admin', 'images', this.title)
        await this.imageRepo.create(image)

        this.images.push(image)

        return image
    }

    public async loadImages() {
        this.images = await this.imageRepo.list()
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

        for (const image of gallery.images) {
            await gallery.imageRepo.remove(image)
        }

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