import {
	array,
	assert,
	enums,
	is,
	object,
	string,
	union,
	type Describe,
} from "superstruct"
import { type SlugifiedCategoryName } from "~/data/achievement.server"

export function isValidSlugifiedCategoryName(
	slug?: string
): slug is SlugifiedCategoryName {
	const ValidSlugifiedCategoryName: Describe<SlugifiedCategoryName> = enums([
		"trailblazer",
		"the-rail-unto-the-stars",
		"eager-for-battle",
		"vestige-of-luminflux",
		"universe-in-a-nutshell",
		"glory-of-the-unyielding",
		"moment-of-joy",
		"the-memories-we-share",
		"fathom-the-unfathomable",
	])

	return is(slug, ValidSlugifiedCategoryName)
}

export function clueBuilder(
	clue: string,
	modifier: {
		italic?: string[]
		highlight?: string[]
		link?: { keyword: string; url: string }[]
	}
) {
	let modifiedClue = clue

	Object.entries(modifier).forEach(([key, values]) => {
		assert(key, enums(["italic", "highlight", "link"]))
		assert(
			values,
			union([
				array(string()),
				array(object({ keyword: string(), url: string() })),
			])
		)

		values.forEach((value) => {
			const toReplaced = typeof value === "string" ? value : value.keyword
			modifiedClue = modifiedClue.replace(toReplaced, clueModifier(value, key))
		})
	})

	return modifiedClue
}

function clueModifier(
	value: string | { keyword: string; url: string },
	modifier: "italic" | "highlight" | "link"
) {
	if (modifier !== "link") {
		return `<span class="clue-${modifier}">${value}</span>`
	}

	assert(value, object({ keyword: string(), url: string() }))
	return `<a href="${value.url}" target="_blank" rel="noopener noreferrer" class="clue-link">${value.keyword}</a>`
}

export function getAchievedAt(createdAt?: Date) {
	const locale = "en"
	const rtf = new Intl.RelativeTimeFormat(locale, {
		style: "short",
	})
	const dtf = new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
	})

	const on = createdAt ? createdAt : new Date()

	const now = new Date()
	const diffInSeconds = (now.getTime() - on.getTime()) / 1000
	const diffInMinutes = diffInSeconds / 60
	const diffInHours = diffInMinutes / 60
	const diffInDays = diffInHours / 24

	let achievedAt: string
	if (diffInDays > 30) {
		achievedAt = dtf.format(createdAt)
	} else if (Math.abs(diffInDays) > 1) {
		achievedAt = rtf.format(Math.round(diffInDays) * -1, "day")
	} else if (Math.abs(diffInHours) > 1) {
		achievedAt = rtf.format(Math.round(diffInHours) * -1, "hour")
	} else if (Math.abs(diffInMinutes) > 1) {
		achievedAt = rtf.format(Math.round(diffInMinutes) * -1, "minute")
	} else {
		achievedAt = "just now"
	}

	return achievedAt
}
