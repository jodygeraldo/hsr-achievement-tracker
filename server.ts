import { cast, connect } from "@planetscale/database"
import { createCookieSessionStorage, logDevReady } from "@remix-run/cloudflare"
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages"
import * as build from "@remix-run/dev/server-build"

if (process.env.NODE_ENV === "development") {
	logDevReady(build)
}

export const onRequest = createPagesFunctionHandler<Env>({
	build,
	getLoadContext: (context) => ({
		sessionStorage: createCookieSessionStorage({
			cookie: {
				name: "__session",
				httpOnly: true,
				path: "/",
				sameSite: "lax",
				secrets: [context.env.SESSION_SECRET],
				secure: process.env.NODE_ENV === "production",
			},
		}),
		db: connect({
			host: context.env.DATABASE_HOST,
			username: context.env.DATABASE_USERNAME,
			password: context.env.DATABASE_PASSWORD,
			cast(field, value) {
				if (field.type === "TIMESTAMP" && value) {
					return new Date(value)
				}
				return cast(field, value)
			},
		}),
	}),
	mode: process.env.NODE_ENV,
})
