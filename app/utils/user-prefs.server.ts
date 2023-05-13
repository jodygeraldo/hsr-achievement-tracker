import { createCookie } from "@remix-run/cloudflare"
import type { Infer } from "superstruct"
import { boolean, defaulted, mask, object } from "superstruct"

const userPrefsSchema = object({
	showMissedFirst: defaulted(boolean(), true),
	showClue: defaulted(
		object({
			normalAchievement: defaulted(
				object({
					beforeAchieved: defaulted(boolean(), true),
					afterAchieved: defaulted(boolean(), true),
				}),
				{}
			),
			secretAchievement: defaulted(
				object({
					beforeAchieved: defaulted(boolean(), false),
					afterAchieved: defaulted(boolean(), true),
				}),
				{}
			),
		}),
		{}
	),
})

type UserPrefs = Infer<typeof userPrefsSchema>

const userPrefsCookie = createCookie("user-prefs")

async function getUserPrefs(request: Request): Promise<UserPrefs> {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = await userPrefsCookie.parse(cookieHeader)
	return mask(cookie ?? {}, userPrefsSchema)
}

export { userPrefsCookie, getUserPrefs }
