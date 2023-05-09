import { createCookieSessionStorage, logDevReady } from "@remix-run/cloudflare"
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages"
import * as build from "@remix-run/dev/server-build"

if (process.env.NODE_ENV === "development") {
	logDevReady(build)
}

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "__session",
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secret: ["INTERESTINGLY_SECURE_SECRET_HERE"],
		secure: process.env.NODE_ENV === "production",
	},
})

export const onRequest = createPagesFunctionHandler({
	build,
	getLoadContext: (context) => ({ env: context.env, sessionStorage }),
	mode: process.env.NODE_ENV,
})
