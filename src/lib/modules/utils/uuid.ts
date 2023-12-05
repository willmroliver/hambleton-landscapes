let id: number = 0;

class UUID {
    id: string;
    #document: Document|undefined = undefined

    constructor(doc: Document|undefined = undefined) {
        id++;
        this.id = `${id}`;

        if (doc) this.#document = doc
    }

    composite(index: number) {
        return `${this.id}-${index}`
    }

    element(index: number|undefined = undefined) {
        if (!this.#document) return undefined
        if (index === undefined) return this.#document.getElementById(`${this.id}`)
        return this.#document.getElementById(this.composite(index))
    }
}

export default UUID;