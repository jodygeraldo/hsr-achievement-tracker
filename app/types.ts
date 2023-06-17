import { type Session, type SessionStorage } from "@remix-run/cloudflare"
import { type SlugifiedCategoryName } from "./data/achievement.server"

type AchievementTable = {
	name: string
	category: SlugifiedCategoryName
	path: string | null
	session_id: string
	created_at: string
}

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

export type { AchievementTable, AppSessionStorage, AppSession, UserSession }
