import { isCuid } from "@paralleldrive/cuid2"
import type { AppDatabase, AppSessionStorage } from "~/types"
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
		isActive: false,
	})
	cookieSession.set("sessions", sessions)

	return cookieSession
}

async function importSession(
	context: {
		sessionStorage: AppSessionStorage
		db: AppDatabase
		request: Request
	},
	data: { name: string; sessionId: string }
) {
	if (!isCuid(data.sessionId)) {
		return
	}

	const isExistInDatabase = await context.db
		.selectFrom("achievement")
		.select("session_id")
		.where("session_id", "=", data.sessionId)
		.executeTakeFirst()

	if (!isExistInDatabase) {
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
