import { init } from "@paralleldrive/cuid2"
import { type AppSessionStorage } from "~/types"

const createId = init({ length: 11 })

async function requiredActiveSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
	activeSessionId: string
}) {
	const setup = await setupSession(context)

	if (setup.session) {
		return { session: setup.session, cookieSession: setup.cookieSession }
	}

	const sessions = await getSessions(context)
	const session = sessions.find((session) => session.isActive)

	if (!session) {
		throw new Error(
			"Failed to acquired active session, this is likely an implementation error",
		)
	}

	return { session, cookieSession: setup.cookieSession }
}

async function optionalActiveSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const sessions = await getSessions(context)
	return sessions.find((session) => session.isActive)
}

async function getSessionId(
	context: {
		sessionStorage: AppSessionStorage
		request: Request
	},
	id: string,
) {
	const sessions = await getSessions(context)
	return sessions.find((session) => session.id === id)?.sessionId
}

async function getPublicSessions(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const sessions = await getSessions(context)
	return sessions.map((session) => ({
		id: session.id,
		name: session.name,
		isActive: session.isActive,
	}))
}

async function getMaskedSessions(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const sessions = await getSessions(context)
	return sessions.map((session) => ({
		...session,
		sessionId: String("*").repeat(session.sessionId.length),
	}))
}

async function setupSession(context: {
	sessionStorage: AppSessionStorage
	request: Request
	activeSessionId: string
}) {
	const cookieSession = await getCookieSession(context)

	if (cookieSession.has("sessions")) {
		return { cookieSession }
	}

	const session = {
		id: context.activeSessionId,
		name: "Guess Session",
		sessionId: createId(),
		isActive: true,
	}
	cookieSession.set("sessions", [session])

	return { cookieSession, session }
}

async function getSessions(context: {
	sessionStorage: AppSessionStorage
	request: Request
}) {
	const cookieSession = await getCookieSession(context)

	const sessions = cookieSession.get("sessions")
	if (!sessions) {
		return []
	}

	return sessions
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
	getSessions,
	getSessionId,
	getPublicSessions,
	getMaskedSessions,
	optionalActiveSession,
	requiredActiveSession,
}
