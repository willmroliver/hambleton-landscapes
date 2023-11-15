import Repo from "./repo";
import { Image, ImageRepo } from "./images";
import { upload } from "$lib/modules/storage/image"

class Gallery {
    title: string
    body: string
    images: Image[]
    imageRepo: ImageRepo

    public constructor(title: string, body: string = '', images: Image[] = []) {
        this.title = title
        this.body = body
        this.images = images

        this.imageRepo = new ImageRepo(title)
    }

    public async saveImage(f: File|Blob|null) {
        if (!f) return

        const image = await upload('admin/images', f as File)
        this.imageRepo.write(image)

        this.images.push(image)
    }

    public async loadImages() {
        this.images = (await this.imageRepo.list()).map(data => new Image(data.name, data.url, data.path))
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

    public async write(gallery: Gallery) {
        return await this.repo.write(this.data(gallery), gallery.title)
    }

    public async update(id: string, gallery: Gallery) {
        return await this.repo.update(id, this.data(gallery))
    }

    private data(gallery: Gallery) {
        return {
            title: gallery.title,
            body: gallery.body,
        }
    }

    private gallery(data: any) {
        return new Gallery(data.title, data.body, data.images)
    }
}

export {
    Gallery,
    GalleryRepo,
}