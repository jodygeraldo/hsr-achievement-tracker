import { init } from "@paralleldrive/cuid2"
import { DatabaseError } from "@planetscale/database"
import { json, redirect } from "@remix-run/cloudflare"
import type { AppDatabase, AppSessionStorage } from "~/types"

const createId = init({ length: 11 })

type SessionAccess = { sessionStorage: AppSessionStorage; request: Request }

async function setupSession({
	db,
	sessionStorage,
	request,
}: { db: AppDatabase } & SessionAccess) {
	const url = new URL(request.url)
	const cookie = request.headers.get("Cookie")
	const session = await sessionStorage.getSession(cookie)

	if (session.has("sessions")) {
		return
	}

	/**
	 * This is function that migrate the format of old account system
	 * The old system is setting session with key `userSessionId`
	 * with the value of random unique id.
	 */
	if (session.has("userSessionId")) {
		const userSessionId = session.get("userSessionId")!
		session.unset("userSessionId")

		try {
			const newSessionId = createId()

			await db
				.updateTable("achievement")
				.set({ session_id: newSessionId })
				.where("session_id", "=", userSessionId)
				.executeTakeFirstOrThrow()

			session.set("sessions", [
				{
					id: createId(),
					name: "Account 1",
					sessionId: newSessionId,
					isActive: true,
				},
			])
		} catch (error) {
			let message = "Failed to migrate your session to current session system"
			if (error instanceof DatabaseError) {
				message = error.message
			}

			throw json({ message }, { status: 500 })
		}

		throw redirect(url.pathname, {
			headers: {
				"Set-Cookie": await sessionStorage.commitSession(session),
			},
		})
	}

	session.set("sessions", [
		{
			id: createId(),
			name: "Account 1",
			sessionId: createId(),
			isActive: true,
		},
	])

	throw redirect(url.pathname, {
		headers: {
			"Set-Cookie": await sessionStorage.commitSession(session),
		},
	})
}

async function getActiveSession({ sessionStorage, request }: SessionAccess) {
	const cookie = request.headers.get("Cookie")
	const appSession = await sessionStorage.getSession(cookie)

	const sessions = appSession.get("sessions")
	if (!sessions) {
		throw json(
			{ message: "No active session found, try refreshing the webpage" },
			{ status: 500 }
		)
	}

	return sessions.filter((session) => session.isActive)[0]
}

async function getSessions({ sessionStorage, request }: SessionAccess) {
	const cookie = request.headers.get("Cookie")
	const session = await sessionStorage.getSession(cookie)

	const sessions = session.get("sessions")
	if (!sessions) {
		throw json(
			{ message: "No active session found, try refreshing the webpage" },
			{ status: 500 }
		)
	}

	return sessions
}

async function getActiveSessionId(sessionAccess: SessionAccess) {
	const activeSession = await getActiveSession(sessionAccess)
	return activeSession.sessionId
}

export { setupSession, getActiveSession, getSessions, getActiveSessionId }
