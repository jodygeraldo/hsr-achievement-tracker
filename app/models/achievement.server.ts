import type { AppLoadContext } from "@remix-run/cloudflare"
import type { SlugifiedCategoryName } from "~/data/achievement.server"
import { achievementByCategory, categories } from "~/data/achievement.server"
import { getAchievedAt } from "~/utils/achievement.server"

type DatabaseAccess = {
	db: AppLoadContext["db"]
	sessionId: string
}

async function getCategories({ db, sessionId }: DatabaseAccess) {
	let achievementSize = 0
	categories.forEach(({ size }) => (achievementSize += size))

	const achievedByCategory = await db
		.selectFrom("achievement")
		.select(["category as slug", db.fn.countAll<string>().as("count")])
		.where("session_id", "=", sessionId)
		.groupBy("category")
		.execute()

	let achievedTotal = 0
	achievedByCategory.forEach(({ count }) => (achievedTotal += Number(count)))

	return {
		achievementSize,
		achievedTotal,
		categories: categories.map((category) => ({
			name: category.name,
			slug: category.slug,
			size: category.size,
			achievedCount:
				achievedByCategory.find(({ slug }) => slug === category.slug)?.count ??
				"0",
		})),
	}
}

async function getAchievements({
	db,
	sessionId,
	slug,
	showMissedFirst,
}: {
	slug: SlugifiedCategoryName
	showMissedFirst: boolean
} & DatabaseAccess) {
	const data = await db
		.selectFrom("achievement")
		.select(["name", "created_at as createdAt", "path"])
		.where(({ and, cmpr }) =>
			and([cmpr("session_id", "=", sessionId), cmpr("category", "=", slug)])
		)
		.orderBy("created_at", "desc")
		.execute()

	const achieved = data.map((d) => {
		return { ...d, achievedAt: getAchievedAt(d.createdAt) }
	})

	const achievements = achievementByCategory[slug].map((achievement) => {
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
		(category) => category.slug === slug
	)?.name

	if (showMissedFirst) {
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

async function modifyAchieved({
	db,
	sessionId,
	slug,
	name,
	intent,
	path,
}: {
	slug: SlugifiedCategoryName
	name: string
	intent: "put" | "delete" | "multi"
	path?: string
} & DatabaseAccess) {
	if (intent === "multi") {
		if (path === "none") {
			await db
				.deleteFrom("achievement")
				.where(({ and, cmpr }) =>
					and([
						cmpr("session_id", "=", sessionId),
						cmpr("category", "=", slug),
						cmpr("name", "=", name),
					])
				)
				.execute()
		} else {
			await db
				.insertInto("achievement")
				.values({
					category: slug,
					session_id: sessionId,
					name,
					path,
				})
				.onDuplicateKeyUpdate({ path })
				.execute()
		}
	} else {
		if (intent === "put") {
			await db
				.insertInto("achievement")
				.values({
					category: slug,
					session_id: sessionId,
					name,
				})
				.execute()
		} else {
			await db
				.deleteFrom("achievement")
				.where(({ and, cmpr }) =>
					and([
						cmpr("session_id", "=", sessionId),
						cmpr("category", "=", slug),
						cmpr("name", "=", name),
					])
				)
				.execute()
		}
	}
}

export { getCategories, getAchievements, modifyAchieved }
