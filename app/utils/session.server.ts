import type { SessionStorage } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"

const SESSION_ID_KEY = "userSessionId"

async function getSessionId(sessionStorage: SessionStorage, request: Request) {
	const url = new URL(request.url)
	const cookie = request.headers.get("Cookie")
	const session = await sessionStorage.getSession(cookie)

	if (session.has(SESSION_ID_KEY)) {
		return session.get(SESSION_ID_KEY)
	} else {
		session.set(SESSION_ID_KEY, crypto.randomUUID())
		throw redirect(url.pathname, {
			headers: {
				"Set-Cookie": await sessionStorage.commitSession(session),
			},
		})
	}
}

export { getSessionId }
