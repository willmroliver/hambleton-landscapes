import db from "$lib/modules/db/firestore"

class Repo {
    private collection: string

    public constructor(collection: string) {
        this.collection = collection
    }

    public async get(id: string): Promise<any> {
        const snap = await db.get(this.collection, id)
        if (snap.exists()) return snap.data()
        else return null
    }

    public async list(): Promise<Array<any>> {
        const snap = await db.list(this.collection)
        
        const results: any[] = []
        snap.forEach(doc => {
            results.push({
                id: doc.id,
                ...doc.data(),
            })
        })

        return results
    }

    public async write(data: any) {
        return await db.write(this.collection, data)
    }

    public async update(id: string, data: any) {
        return await db.update(this.collection, id, data)
    }
}

export default Repo