import { init } from "@paralleldrive/cuid2"
import { DatabaseError, type Connection } from "@planetscale/database"
import { json, redirect } from "@remix-run/cloudflare"
import { type AppSessionStorage } from "~/types"

const createId = init({ length: 11 })

async function getCookieSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const cookie = context.request.headers.get("Cookie")
	return context.sessionStorage.getSession(cookie)
}

async function setupSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
	db: Connection
}) {
	const url = new URL(context.request.url)
	const cookieSession = await getCookieSession(context)

	if (cookieSession.has("sessions")) {
		return
	}

	/**
	 * This is function that migrate the format of old account system
	 * The old system is setting session with key `userSessionId`
	 * with the value of random unique id.
	 */
	if (cookieSession.has("userSessionId")) {
		const userSessionId = cookieSession.get("userSessionId")!
		cookieSession.unset("userSessionId")

		try {
			const newSessionId = createId()

			await context.db.execute(
				"UPDATE achievement SET session_id = ? WHERE session_id = ?",
				[newSessionId, userSessionId]
			)

			cookieSession.set("sessions", [
				{
					id: createId(),
					name: "Account 1",
					sessionId: newSessionId,
					isActive: true,
				},
			])
		} catch (error) {
			console.error(error)
			let message = "Failed to migrate your session to current session system"
			if (error instanceof DatabaseError) {
				message = error.message
			}

			throw json({ message }, { status: 500 })
		}

		throw redirect(url.pathname, {
			headers: {
				"Set-Cookie": await context.sessionStorage.commitSession(cookieSession),
			},
		})
	}

	cookieSession.set("sessions", [
		{
			id: createId(),
			name: "Account 1",
			sessionId: createId(),
			isActive: true,
		},
	])

	throw redirect(url.pathname, {
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

export {
	createId,
	getCookieSession,
	setupSession,
	getActiveSession,
	getSessions,
	getActiveSessionId,
}
