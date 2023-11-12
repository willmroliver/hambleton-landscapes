import session from "$lib/stores/session"

class HTTP {
    private headers = new Headers()

    public constructor(headers: any = null) {
        if (!headers) {
            headers = {
                'Content-Type': 'application/json',
            }
        }
        Object.keys(headers).forEach(key => {
            this.headers.set(key, headers[key] as string)
        })

        session.subscribe(value => {
            this.headers.set('Set-Cookie', `idtoken=${value.idToken}`)
        })
    }

    public async get(path: string, body?: any): Promise<any> {
        const res = await fetch(path, {
            method: 'GET',
            headers: this.headers,
            body,
        })
        
        return await res.json()
    }
}

export default HTTP