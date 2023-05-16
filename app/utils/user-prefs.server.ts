import { createCookie } from "@remix-run/cloudflare"
import type { Infer } from "superstruct"
import {
	StructError,
	boolean,
	enums,
	is,
	mask,
	object,
	type,
} from "superstruct"

const userPrefsStruct = type({
	showMissedFirst: boolean(),
	showClue: object({
		normalAchievement: object({
			beforeAchieved: boolean(),
			afterAchieved: boolean(),
		}),
		secretAchievement: object({
			beforeAchieved: boolean(),
			afterAchieved: boolean(),
		}),
	}),
})

type UserPrefs = Infer<typeof userPrefsStruct>

const defaultUserPrefs: UserPrefs = {
	showMissedFirst: true,
	showClue: {
		normalAchievement: {
			beforeAchieved: true,
			afterAchieved: true,
		},
		secretAchievement: {
			beforeAchieved: false,
			afterAchieved: true,
		},
	},
}

const userPrefsCookie = createCookie("user-prefs")

async function getUserPrefs(request: Request) {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = await userPrefsCookie.parse(cookieHeader)

	if (!cookie) {
		return defaultUserPrefs
	}

	try {
		return mask(
			{ showClue: { normalAchievement: { beforeAchieved: true } } },
			userPrefsStruct
		)
	} catch (error) {
		if (error instanceof StructError) {
			let hasUnexpectedFailure = false
			const failures = error.failures()
			failures.forEach((failure) => {
				if (is(failure.key, enums(["showMissedFirst", "showClue"]))) {
					cookie[failure.key] = defaultUserPrefs[failure.key]
				} else if (
					is(failure.key, enums(["normalAchievement", "secretAchievement"]))
				) {
					cookie.showClue[failure.key] = defaultUserPrefs.showClue[failure.key]
				} else {
					hasUnexpectedFailure = true
				}
			})

			if (hasUnexpectedFailure) {
				return defaultUserPrefs
			}
			return cookie as UserPrefs
		}
		throw error
	}
}

export type { UserPrefs }
export { userPrefsCookie, getUserPrefs }
