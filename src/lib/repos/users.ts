import Repo from "./repo"

class UserRepo {
    private repo = new Repo('users')

    public async get(id: string) {
        return await this.repo.get(id)
    }

    public async list() {
        return await this.repo.list()
    }

    public async create(data: any) {
        return await this.repo.create(data)
    }

    public async update(id: string, data: any) {
        return await this.repo.update(id, data)
    }
}

export default UserRepo