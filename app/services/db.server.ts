import type { Generated } from "kysely"
import { Kysely } from "kysely"
import { PlanetScaleDialect } from "kysely-planetscale"

interface AchievementTable {
	id: Generated<number>
	session_id: string
	name: string
	category: string
}

interface Database {
	achievement: AchievementTable
}

function getDbConnection(env: Env) {
	const db = new Kysely<Database>({
		dialect: new PlanetScaleDialect({
			host: env.DATABASE_HOST,
			username: env.DATABASE_USERNAME,
			password: env.DATABASE_PASSWORD,
		}),
	})

	return db
}

export type { Database }
export { getDbConnection }
