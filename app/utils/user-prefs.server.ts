import { createCookie } from "@remix-run/cloudflare"
import { assert, boolean, create, defaulted, type } from "superstruct"

const UserPrefs = type({
	enableAchievedBottom: defaulted(boolean(), false),
})

const userPrefsCookie = createCookie("user-prefs")

async function getUserPrefs(request: Request) {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = (await userPrefsCookie.parse(cookieHeader)) ?? undefined

	return create(cookie, UserPrefs)
}

async function getEnableAchievedBottom(request: Request) {
	const cookie = await getUserPrefs(request)
	const enableAchievedBottom = cookie.enableAchievedBottom
	assert(enableAchievedBottom, boolean())
	return enableAchievedBottom
}

export { userPrefsCookie, getUserPrefs, getEnableAchievedBottom }

