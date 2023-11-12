import { json } from "@sveltejs/kit"
import { auth } from "$lib/server/firebase/app"
import UserRepo from "$lib/repos/users.js"

const repo = new UserRepo()

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
    const token: string|undefined = cookies.get('idtoken');

    if (!token) return json(
        { message: 'Missing/Invalid Token' }, 
        { status: 400 }
    )

    const claims = await auth.verifyIdToken(token)
    const user = await repo.get(claims.uid)

    auth.setCustomUserClaims(claims.uid, {
        admin: user.admin,
    })

    return json(
        { user }, 
        { status: 200 }
    )
}