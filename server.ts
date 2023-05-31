import { createCookieSessionStorage, logDevReady } from "@remix-run/cloudflare"
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages"
import * as build from "@remix-run/dev/server-build"

if (process.env.NODE_ENV === "development") {
	logDevReady(build)
}

export const onRequest = createPagesFunctionHandler<Env>({
	build,
	getLoadContext: (context) => ({
		db: context.env.DB,
		sessionStorage: createCookieSessionStorage({
			cookie: {
				name: "__session",
				httpOnly: true,
				path: "/",
				sameSite: "lax",
				secrets: [context.env.SESSION_SECRET],
				secure: process.env.NODE_ENV === "production",
				maxAge: 15_768_000, // 6 months
			},
		}),
	}),
	mode: process.env.NODE_ENV,
})
