class HTTP {
    private headers = new Headers()

    public constructor() {
        let headers: any = {
            'Content-Type': 'application/json',
        }

        Object.keys(headers).forEach(key => {
            this.headers.set(key, headers[key] as string)
        })
    }

    private async request(path: string, method: string, body?: any): Promise<any> {
        const res = await fetch(path, {
            method,
            headers: this.headers,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(body)
        })

        const json = await res.json()

        return {
            status: res.status,
            body: json,
        }
    }

    public async get(path: string, body?: any): Promise<any> {
        return await this.request(path, 'GET', body)
    }

    public async post(path: string, body?: any): Promise<any> {
        return await this.request(path, 'POST', body)
    }
}

export default HTTP