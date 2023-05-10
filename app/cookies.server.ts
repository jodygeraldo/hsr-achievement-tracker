import { createCookie, json } from "@remix-run/cloudflare"
import { assert, boolean, create, defaulted, type } from "superstruct"

const userPrefs = createCookie("user-prefs")

async function getUserPrefsCookie(request: Request) {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = await userPrefs.parse(cookieHeader)

	return create(
		cookie,
		defaulted(type({ enableAchievedBottom: boolean() }), {
			enableAchievedBottom: false,
		})
	)
}

async function getEnableAchievedBottom(request: Request) {
	const cookie = await getUserPrefsCookie(request)
	const enableAchievedBottom = cookie.enableAchievedBottom
	assert(enableAchievedBottom, boolean())
	return enableAchievedBottom
}

async function setEnableAchievedBottom(request: Request) {
	const cookie = await getUserPrefsCookie(request)
	const formData = await request.formData()
	cookie.enableAchievedBottom = formData.get("checked") === "true"

	return json(null, {
		headers: {
			"Set-Cookie": await userPrefs.serialize(cookie),
		},
	})
}

export { getEnableAchievedBottom, setEnableAchievedBottom }
