import { createCookie } from "@remix-run/cloudflare"
import { boolean, create, defaulted, type } from "superstruct"

const UserPrefs = type({
	showMissedFirst: defaulted(boolean(), false),
})

const userPrefsCookie = createCookie("user-prefs")

async function getUserPrefs(request: Request) {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = (await userPrefsCookie.parse(cookieHeader)) ?? undefined

	return create(cookie, UserPrefs)
}

export { userPrefsCookie, getUserPrefs }
