import type { Describe } from "superstruct"
import { array, assert, enums, is, object, string, union } from "superstruct"
import type { SlugifiedCategoryName } from "~/models/achievement.server"

export function isValidSlugifiedCategoryName(
	slug: string
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
		console.log(key, values)

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
