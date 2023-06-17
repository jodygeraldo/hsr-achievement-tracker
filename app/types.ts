import { type Session, type SessionStorage } from "@remix-run/cloudflare"

type UserSession = {
	id: string
	name: string
	sessionId: string
	isActive: boolean
}

type Account = {
	sessions: UserSession[]
}

type AppSessionStorage = SessionStorage<Account>
type AppSession = Session<Account>

export type { AppSessionStorage, AppSession, UserSession }
