import { isCuid } from "@paralleldrive/cuid2"
import { type Connection } from "@planetscale/database"
import { type AppSessionStorage } from "~/types"
import { createId, getCookieSession, getSessions } from "~/utils/session.server"

async function setActiveSession(
	context: {
		sessionStorage: AppSessionStorage
		request: Request
	},
	id: string
) {
	const cookieSession = await getCookieSession(context)
	const sessions = await getSessions(context)

	const sessionIndex = sessions.findIndex((session) => session.id === id)
	if (sessionIndex === -1) {
		return
	}

	cookieSession.set(
		"sessions",
		sessions.map((session, index) => ({
			id: session.id,
			name: session.name,
			sessionId: session.sessionId,
			isActive: index === sessionIndex ? true : false,
		}))
	)

	return cookieSession
}

async function newSession(
	context: {
		sessionStorage: AppSessionStorage
		request: Request
	},
	name: string
) {
	const cookieSession = await getCookieSession(context)
	const sessions = await getSessions(context)

	if (sessions.length >= 7) {
		return
	}

	sessions.push({
		id: createId(),
		name,
		sessionId: createId(),
		isActive: sessions.length === 0 ? true : false,
	})
	cookieSession.set("sessions", sessions)

	return cookieSession
}

async function importSession(
	context: {
		sessionStorage: AppSessionStorage
		db: Connection
		request: Request
	},
	data: { name: string; sessionId: string }
) {
	if (!isCuid(data.sessionId)) {
		return
	}

	const isExistInDatabase = await context.db.execute(
		"SELECT session_id FROM achievement WHERE session_id = ? LIMIT 1",
		[data.sessionId]
	)

	if (isExistInDatabase.size === 0) {
		return
	}

	const cookieSession = await getCookieSession(context)
	const sessions = await getSessions(context)

	sessions.push({
		id: createId(),
		name: data.name,
		sessionId: data.sessionId,
		isActive: false,
	})
	cookieSession.set("sessions", sessions)

	return cookieSession
}

async function updateSessionName(
	context: {
		sessionStorage: AppSessionStorage
		request: Request
	},
	data: { id: string; newName: string }
) {
	const cookieSession = await getCookieSession(context)
	const sessions = await getSessions(context)

	const sessionIndex = sessions.findIndex((session) => session.id === data.id)
	if (sessionIndex === -1) {
		return
	}

	cookieSession.set(
		"sessions",
		sessions.map((session, index) => ({
			id: session.id,
			name: index === sessionIndex ? data.newName : session.name,
			sessionId: session.sessionId,
			isActive: session.isActive,
		}))
	)

	return cookieSession
}

async function removeSession(
	context: {
		sessionStorage: AppSessionStorage
		request: Request
	},
	id: string
) {
	const cookieSession = await getCookieSession(context)
	const sessions = await getSessions(context)

	const sessionIndex = sessions.findIndex((session) => session.id === id)
	if (sessionIndex === -1) {
		return
	}

	sessions.splice(sessionIndex, 1)
	cookieSession.set("sessions", sessions)

	return cookieSession
}

export {
	setActiveSession,
	newSession,
	importSession,
	updateSessionName,
	removeSession,
}
