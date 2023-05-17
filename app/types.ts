import type { SessionStorage } from "@remix-run/cloudflare"
import type { Generated } from "kysely"

interface AchievementTable {
	id: Generated<number>
	session_id: string
	name: string
	category: string
	path: string | null
}

interface Database {
	achievement: AchievementTable
}

type AppSession = SessionStorage<{ userSessionId: string }>

export type { Database, AppSession }
