import db from "$lib/modules/db/firestore"

class Repo {
    private path: string
    private pathSegments: string[]

    public constructor(path: string, ...pathSegments: string[]) {
        this.path = path
        this.pathSegments = pathSegments
    }

    public async get(id: string): Promise<any> {
        const snap = await db.get(id, this.path, ...this.pathSegments)
        if (snap.exists()) return snap.data()
        else return null
    }

    public async list(): Promise<Array<any>> {
        const snap = await db.list(this.path, ...this.pathSegments)
        
        const results: any[] = []
        snap.forEach(doc => {
            results.push({
                id: doc.id,
                ...doc.data(),
            })
        })

        return results
    }

    public async write(data: any, id?: string) {
        if (id) return await db.update(id, data, this.path, ...this.pathSegments)
        return await db.write(data, this.path, ...this.pathSegments)
    }

    public async update(id: string, data: any) {
        return await db.update(id, data, this.path, ...this.pathSegments)
    }
}

export default Repo