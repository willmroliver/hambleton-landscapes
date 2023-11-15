import Repo from "./repo";

class Image {
    name: string
    path: string
    url: string
    description: string

    public constructor(name: string, url: string, path: string, description: string = '') {
        this.name = name
        this.url = url
        this.path = path
        this.description = description
    }
}

class ImageRepo {
    private repo: Repo

    public constructor(gallery: string) {
        this.repo = new Repo('admin', 'all', 'galleries', gallery, 'images')
    }

    public async get(id: string) {
        return this.image(await this.repo.get(id))
    }

    public async list() {
        return (await this.repo.list()).map(data => this.image(data))
    }

    public async write(image: Image) {
        return await this.repo.write(this.data(image), image.name)
    }

    public async update(id: string, image: Image) {
        return await this.repo.update(id, this.data(image))
    }

    private data(image: Image) {
        return {
            name: image.name,
            url: image.url,
            path: image.path,
        }
    }

    private image(data: any) {
        return new Image(data.id, data.url, data.path, data.description)
    }
}

export {
    Image,
    ImageRepo,
}