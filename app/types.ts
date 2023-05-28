import { type Session, type SessionStorage } from "@remix-run/cloudflare"
import { type Generated, type Kysely } from "kysely"

interface AchievementTable {
	id: Generated<number>
	session_id: string
	name: string
	category: string
	path: string | null
	created_at: Generated<Date>
}

interface Database {
	achievement: AchievementTable
}

type AppDatabase = Kysely<Database>

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

export type {
	Database,
	AppDatabase,
	AppSessionStorage,
	AppSession,
	UserSession,
}
