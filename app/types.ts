import { type Session, type SessionStorage } from "@remix-run/cloudflare"

/**
 * @deprecated This type is deprecated and should not be used
 */
type OLD_Account = { userSessionId: string }

type UserSession = {
	id: string
	name: string
	sessionId: string
	isActive: boolean
}

type Account = {
	sessions: UserSession[]
}

type AppSessionStorage = SessionStorage<OLD_Account & Account>
type AppSession = Session<OLD_Account & Account>

export type { AppSessionStorage, AppSession, UserSession }
