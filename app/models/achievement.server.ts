import invariant from "tiny-invariant"
import {
	achievementByCategory,
	achievementMetadata,
	categories,
	type SlugifiedCategoryName,
} from "~/data/achievement.server"
import { type AchievementTable } from "~/types"
import { getAchievedAt } from "~/utils/achievement.server"

async function getHomeAchievementData(
	db: D1Database,
	data: { sessionId: string }
) {
	const rows = await db.batch([
		// prettier-ignore
		db
			.prepare(
				"SELECT name, category FROM achievement WHERE session_id = ?"
			)
			.bind(data.sessionId),
		db
			.prepare(
				"SELECT name, category, path, created_at AS `createdAt` FROM achievement WHERE session_id = ? ORDER BY created_at DESC LIMIT 10"
			)
			.bind(data.sessionId),
		// prettier-ignore
		db
			.prepare(
				"SELECT count(DISTINCT session_id) as `totalSessions` FROM achievement"
			),
		db
			.prepare(
				"SELECT count(*) + ? AS `rank` FROM (SELECT session_id, count(*) AS total_achievements FROM achievement GROUP BY session_id) AS a JOIN (SELECT session_id, count(*) AS total_achievements FROM achievement where session_id = ?) AS b on a.session_id != b.session_id where a.total_achievements > b.total_achievements"
			)
			.bind(1, data.sessionId),
	])
	const achievedRows = rows[0].results as
		| Pick<AchievementTable, "name" | "category">[]
		| undefined
	const latestAchievedRows = rows[1].results as
		| Pick<AchievementTable, "name" | "category" | "path" | "created_at">[]
		| undefined
	const totalSessionsRows = rows[2].results as
		| [{ totalSessions: string }]
		| undefined
	const rankRows = rows[3].results as [{ rank: string }] | undefined

	if (!achievedRows || !latestAchievedRows || !totalSessionsRows || !rankRows) {
		throw new Error()
	}

	const totalSessions = Number(totalSessionsRows[0].totalSessions)
	const rank = Number(rankRows[0].rank)
	const percentileRank = (rank / totalSessions) * 100

	let topPercentileRank: string
	if (achievedRows.length === 0) {
		topPercentileRank = `bottom 0.01%`
	} else if (percentileRank <= 0.01) {
		topPercentileRank = `top 0.01%`
	} else if (percentileRank >= 99.99) {
		topPercentileRank = `bottom 0.01%`
	} else if (percentileRank >= 50) {
		topPercentileRank = `bottom ${(100 - percentileRank).toFixed(2)}%`
	} else {
		topPercentileRank = `top ${percentileRank.toFixed(2)}%`
	}

	let secretAchieved = 0
	let currentVersionAchieved = 0
	achievedRows.forEach((ach) => {
		const done = achievementByCategory[
			ach.category as SlugifiedCategoryName
		].find((achievement) => achievement.name.toString() === ach.name)
		if (done?.isSecret) {
			secretAchieved += 1
		}
		if (done?.version === achievementMetadata.currentVersion) {
			currentVersionAchieved += 1
		}
	})
	const currentVersion = {
		num: achievementMetadata.currentVersion,
		achieved: currentVersionAchieved,
		size: achievementMetadata.size[achievementMetadata.currentVersion],
	}

	return {
		percentileRank: topPercentileRank,
		rank,
		secretAchieved,
		currentVersion,
		latestAchieved: latestAchievedRows.map((ach) => {
			const categoryName = categories.find(
				({ slug }) => slug === ach.category
			)?.name
			const achievementData = achievementByCategory[
				ach.category as SlugifiedCategoryName
			].find((achievement) => achievement.name.toString() === ach.name)

			if (!achievementData || !categoryName) {
				throw new Error("Encountered invalid data")
			}

			const createdAt = new Date(ach.created_at)

			return {
				name: ach.path ?? ach.name,
				slug: ach.category,
				category: categoryName,
				version: achievementData?.version,
				isSecret: achievementData?.isSecret,
				achievedAt: {
					formatted: getAchievedAt(createdAt),
					raw: createdAt.toISOString(),
				},
			}
		}),
	}
}

async function getCategories(db: D1Database, data: { sessionId: string }) {
	let achievementSize = 0
	categories.forEach(({ size }) => (achievementSize += size))

	const { results: rows } = await db
		.prepare(
			"SELECT category, count(*) AS `count` FROM achievement WHERE session_id = ? GROUP BY category"
		)
		.bind(data.sessionId)
		.all<Pick<AchievementTable, "category"> & { count: string }>()

	invariant(rows, "getAchievements|rows")

	let achievedTotal = 0
	rows.forEach(({ count }) => (achievedTotal += Number(count)))

	return {
		achievementSize,
		achievedTotal,
		categories: categories.map((category) => ({
			...category,
			achievedCount:
				rows.find((row) => row.category === category.slug)?.count ?? "0",
		})),
	}
}

async function getAchievements(
	db: D1Database,
	data: { sessionId: string; slug: SlugifiedCategoryName },
	options: { showMissedFirst: boolean }
) {
	const { results: rows } = await db
		.prepare(
			"SELECT name, created_at, path FROM achievement WHERE session_id = ? AND category = ? ORDER BY created_at DESC"
		)
		.bind(data.sessionId, data.slug)
		.all<Pick<AchievementTable, "name" | "created_at" | "path">>()

	invariant(rows, "getAchievements|rows")

	const achieved = rows.map((d) => {
		const createdAt = new Date(d.created_at)
		return { ...d, createdAt, achievedAt: getAchievedAt(createdAt) }
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
	db: D1Database,
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
			await db
				.prepare(
					"INSERT INTO achievement(session_id, name, category, path) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE path = ?"
				)
				.bind(data.sessionId, data.name, data.slug, data.path, data.path)
				.run()
			break
		}
		case "put": {
			await db
				.prepare(
					"INSERT INTO achievement(session_id, name, category) VALUES (?, ?, ?)"
				)
				.bind(data.sessionId, data.name, data.slug)
				.run()
			break
		}
		case "delete": {
			await db
				.prepare(
					"DELETE FROM achievement WHERE session_id = ? AND category = ? AND name = ?"
				)
				.bind(data.sessionId, data.slug, data.name)
				.run()
			break
		}
		default:
			throw new Error("Invalid data intent on modifyAchieved")
	}
}

export {
	getHomeAchievementData,
	getCategories,
	getAchievements,
	modifyAchieved,
}
