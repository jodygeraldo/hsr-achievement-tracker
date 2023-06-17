import { init } from "@paralleldrive/cuid2"
import { json, redirect } from "@remix-run/cloudflare"
import { type AppSessionStorage } from "~/types"

const createId = init({ length: 11 })

async function setupSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const cookieSession = await getCookieSession(context)

	if (cookieSession.has("sessions")) {
		return
	}

	cookieSession.set("sessions", [
		{
			id: createId(),
			name: "Guess Session",
			sessionId: createId(),
			isActive: true,
		},
	])

	const redirectTo = new URL(context.request.url).pathname
	throw redirect(redirectTo, {
		headers: {
			"Set-Cookie": await context.sessionStorage.commitSession(cookieSession),
		},
	})
}

async function getActiveSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const cookieSession = await getCookieSession(context)

	const sessions = cookieSession.get("sessions")
	if (!sessions) {
		throw json(
			{ message: "No active session found, try refreshing the webpage" },
			{ status: 500 }
		)
	}

	return sessions.filter((session) => session.isActive)[0]
}

async function getSessions(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const cookieSession = await getCookieSession(context)

	const sessions = cookieSession.get("sessions")
	if (!sessions) {
		throw json(
			{ message: "No active session found, try refreshing the webpage" },
			{ status: 500 }
		)
	}

	return sessions
}

async function getActiveSessionId(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const activeSession = await getActiveSession(context)
	return activeSession.sessionId
}

async function getCookieSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const cookie = context.request.headers.get("Cookie")
	return context.sessionStorage.getSession(cookie)
}
export {
	createId,
	getCookieSession,
	setupSession,
	getActiveSession,
	getSessions,
	getActiveSessionId,
}
