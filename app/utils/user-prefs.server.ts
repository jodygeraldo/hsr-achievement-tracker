import { createCookie } from "@remix-run/cloudflare"
import type { Infer } from "superstruct"
import { boolean, create, defaulted, object, type } from "superstruct"

const userPrefsSchema = type({
	showMissedFirst: defaulted(boolean(), false),
	showClue: object({
		normalAchievement: defaulted(boolean(), false),
		secretAchievement: defaulted(boolean(), false),
	}),
})

type UserPrefs = Infer<typeof userPrefsSchema>

const userPrefsCookie = createCookie("user-prefs")

async function getUserPrefs(request: Request): Promise<UserPrefs> {
	const defaultUserPrefs: UserPrefs = {
		showMissedFirst: false,
		showClue: {
			normalAchievement: false,
			secretAchievement: false,
		},
	}
	const cookieHeader = request.headers.get("Cookie")
	const cookie = (await userPrefsCookie.parse(cookieHeader)) ?? defaultUserPrefs

	return create(cookie, userPrefsSchema)
}

export { userPrefsCookie, getUserPrefs }
