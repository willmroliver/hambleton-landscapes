let id: number = 0;

class UUID {
    id: string;

    constructor() {
        id++;
        this.id = `${id}`;
    }
}

export default UUID;