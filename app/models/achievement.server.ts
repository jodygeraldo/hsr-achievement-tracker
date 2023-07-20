import { type Connection } from "@planetscale/database"
import { array, assert, date, nullable, object, string } from "superstruct"
import {
	achievementByCategory,
	achievementMetadata,
	categories,
	type SlugifiedCategoryName,
} from "~/data/achievement.server"
import { getAchievedAt } from "~/utils/achievement.server"

async function getHomeAchievementData(
	db: Connection,
	data: { sessionId: string },
) {
	const AchievedStruct = array(
		object({
			name: string(),
			category: string(),
		}),
	)
	const LatestAchievedStruct = array(
		object({
			name: string(),
			category: string(),
			path: nullable(string()),
			createdAt: date(),
		}),
	)
	const TotalSessionsStruct = array(object({ totalSessions: string() }))
	const RankStruct = array(object({ rank: string() }))

	const [
		{ rows: achievedRows },
		{ rows: latestAchievedRows },
		{ rows: totalSessionsRows },
		{ rows: rankRows },
	] = await Promise.all([
		db.execute("SELECT name, category FROM achievement WHERE session_id = ?", [
			data.sessionId,
		]),
		db.execute(
			"SELECT name, category, path, created_at AS `createdAt` FROM achievement WHERE session_id = ? ORDER BY created_at DESC LIMIT 10",
			[data.sessionId],
		),
		db.execute(
			"SELECT count(DISTINCT session_id) as `totalSessions` FROM achievement",
		),
		db.execute(
			"SELECT count(*) + ? AS `rank` FROM (SELECT session_id, count(*) AS total_achievements FROM achievement GROUP BY session_id) AS a JOIN (SELECT session_id, count(*) AS total_achievements FROM achievement where session_id = ?) AS b on a.session_id != b.session_id where a.total_achievements > b.total_achievements",
			[1, data.sessionId],
		),
	])
	assert(achievedRows, AchievedStruct)
	assert(latestAchievedRows, LatestAchievedStruct)
	assert(totalSessionsRows, TotalSessionsStruct)
	assert(rankRows, RankStruct)

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
			const categoryName = categories.find(({ slug }) => slug === ach.category)
				?.name
			const achievementData = achievementByCategory[
				ach.category as SlugifiedCategoryName
			].find((achievement) => achievement.name.toString() === ach.name)

			if (!achievementData || !categoryName) {
				throw new Error("Encountered invalid data")
			}

			return {
				name: ach.path ?? ach.name,
				slug: ach.category,
				category: categoryName,
				version: achievementData?.version,
				isSecret: achievementData?.isSecret,
				achievedAt: {
					formatted: getAchievedAt(ach.createdAt),
					raw: ach.createdAt.toISOString(),
				},
			}
		}),
	}
}

async function getCategories(db: Connection, data: { sessionId: string }) {
	let achievementSize = 0
	categories.forEach(({ size }) => (achievementSize += size))

	const { rows } = await db.execute(
		"SELECT category AS `slug`, count(*) AS `count` FROM achievement WHERE session_id = ? GROUP BY category",
		[data.sessionId],
	)
	const Struct = array(
		object({
			slug: string(),
			count: string(),
		}),
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
	options: { showMissedFirst: boolean },
) {
	const { rows } = await db.execute(
		"SELECT name, created_at AS `createdAt`, path FROM achievement WHERE session_id = ? AND category = ? ORDER BY created_at DESC",
		[data.sessionId, data.slug],
	)

	const Struct = array(
		object({
			name: string(),
			createdAt: date(),
			path: nullable(string()),
		}),
	)
	assert(rows, Struct)

	const achieved = rows.map((d) => {
		return { ...d, achievedAt: getAchievedAt(d.createdAt) }
	})

	const achievements = achievementByCategory[data.slug].map((achievement) => {
		const done = achieved.find(
			({ name }) => name === achievement.name.toString(),
		)

		return {
			...achievement,
			achievedAt: done?.achievedAt,
			path: done?.path ?? undefined,
		}
	})

	const categoryName = categories.find(
		(category) => category.slug === data.slug,
	)?.name

	if (options.showMissedFirst) {
		achievements.sort(
			(first, second) =>
				Number(Boolean(first.achievedAt)) - Number(Boolean(second.achievedAt)),
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
	},
) {
	switch (data.intent) {
		case "multi": {
			await db.execute(
				"INSERT INTO achievement(session_id, name, category, path) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE path = ?",
				[data.sessionId, data.name, data.slug, data.path, data.path],
			)
			break
		}
		case "put": {
			await db.execute(
				"INSERT INTO achievement(session_id, name, category) VALUES (?, ?, ?)",
				[data.sessionId, data.name, data.slug],
			)
			break
		}
		case "delete": {
			await db.execute(
				"DELETE FROM achievement WHERE session_id = ? AND category = ? AND name = ?",
				[data.sessionId, data.slug, data.name],
			)
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
