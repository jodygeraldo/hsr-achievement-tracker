import { type Connection } from "@planetscale/database"
import { array, assert, date, nullable, object, string } from "superstruct"
import {
	achievementByCategory,
	categories,
	type SlugifiedCategoryName,
} from "~/data/achievement.server"
import { getAchievedAt } from "~/utils/achievement.server"

async function getCategories(db: Connection, data: { sessionId: string }) {
	let achievementSize = 0
	categories.forEach(({ size }) => (achievementSize += size))

	const { rows } = await db.execute(
		"SELECT category as `slug`, count(*) as `count` FROM achievement WHERE session_id = ? GROUP BY category",
		[data.sessionId]
	)
	const Struct = array(
		object({
			slug: string(),
			count: string(),
		})
	)
	assert(rows, Struct)

	let achievedTotal = 0
	rows.forEach(({ count }) => (achievedTotal += Number(count)))

	return {
		achievementSize,
		achievedTotal,
		categories: categories.map((category) => ({
			...category,
			achievedCount:
				rows.find(({ slug }) => slug === category.slug)?.count ?? "0",
		})),
	}
}

async function getAchievements(
	db: Connection,
	data: { sessionId: string; slug: SlugifiedCategoryName },
	options: { showMissedFirst: boolean }
) {
	const { rows } = await db.execute(
		"SELECT name, created_at as `createdAt`, path FROM achievement WHERE session_id = ? AND category = ? ORDER BY created_at DESC",
		[data.sessionId, data.slug]
	)

	const Struct = array(
		object({
			name: string(),
			createdAt: date(),
			path: nullable(string()),
		})
	)
	assert(rows, Struct)

	const achieved = rows.map((d) => {
		return { ...d, achievedAt: getAchievedAt(d.createdAt) }
	})

	const achievements = achievementByCategory[data.slug].map((achievement) => {
		const done = achieved.find(
			({ name }) => name === achievement.name.toString()
		)

		return {
			...achievement,
			achievedAt: done?.achievedAt,
			path: done?.path ?? undefined,
		}
	})

	const categoryName = categories.find(
		(category) => category.slug === data.slug
	)?.name

	if (options.showMissedFirst) {
		achievements.sort(
			(first, second) =>
				Number(Boolean(first.achievedAt)) - Number(Boolean(second.achievedAt))
		)
	}

	return {
		categoryName,
		achievements,
		achieved: achieved.map((ach) => ({
			name: ach.path ?? ach.name,
			achievedAt: {
				formatted: ach.achievedAt,
				raw: ach.createdAt.toISOString(),
			},
		})),
	}
}

async function modifyAchieved(
	db: Connection,
	data: {
		sessionId: string
		slug: SlugifiedCategoryName
		name: string
		intent: "put" | "delete" | "multi"
		path?: string
	}
) {
	switch (data.intent) {
		case "multi": {
			await db.execute(
				"INSERT INTO achievement(session_id, name, category, path) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE path = ?",
				[data.sessionId, data.name, data.slug, data.path, data.path]
			)
			break
		}
		case "put": {
			await db.execute(
				"INSERT INTO achievement(session_id, name, category) VALUES (?, ?, ?)",
				[data.sessionId, data.name, data.slug]
			)
			break
		}
		case "delete": {
			await db.execute(
				"DELETE FROM achievement WHERE session_id = ? AND category = ? AND name = ?",
				[data.sessionId, data.slug, data.name]
			)
			break
		}
		default:
			throw new Error("Invalid data intent on modifyAchieved")
	}
}

export { getCategories, getAchievements, modifyAchieved }
