import { createCookie, json } from "@remix-run/cloudflare"
import { assert, boolean } from "superstruct"

const userPrefs = createCookie("user-prefs")

async function getUserPrefsCookie(request: Request) {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = (await userPrefs.parse(cookieHeader)) || {
		hideComplete: false,
	}
	return cookie
}

async function getHideCompletePref(request: Request) {
	const cookie = await getUserPrefsCookie(request)
	const hideCompletePref = cookie.hideComplete
	assert(hideCompletePref, boolean())
	return hideCompletePref
}

async function setHideCompletePref(request: Request) {
	const cookie = await getUserPrefsCookie(request)
	const formData = await request.formData()
	const hideComplete = formData.get("checked") === "true"
	cookie.hideComplete = hideComplete

	return json(null, {
		headers: {
			"Set-Cookie": await userPrefs.serialize(cookie),
		},
	})
}

export { getHideCompletePref, setHideCompletePref }
