import type { SessionStorage } from "@remix-run/cloudflare"
import type { Generated } from "kysely"

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

type AppSession = SessionStorage<{ userSessionId: string }>

export type { Database, AppSession }
