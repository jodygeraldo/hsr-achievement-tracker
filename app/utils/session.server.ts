import type { AppLoadContext } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"
import { uid } from "uid"

async function getSessionId(
	sessionStorage: AppLoadContext["sessionStorage"],
	request: Request
) {
	const url = new URL(request.url)
	const cookie = request.headers.get("Cookie")
	const session = await sessionStorage.getSession(cookie)

	const sessionId = session.get("userSessionId")

	if (!sessionId) {
		session.set("userSessionId", uid())
		throw redirect(url.pathname, {
			headers: {
				"Set-Cookie": await sessionStorage.commitSession(session),
			},
		})
	}

	return sessionId
}

export { getSessionId }
