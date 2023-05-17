import { createCookieSessionStorage, logDevReady } from "@remix-run/cloudflare"
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages"
import * as build from "@remix-run/dev/server-build"
import { Kysely } from "kysely"
import { PlanetScaleDialect } from "kysely-planetscale"

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
		db: new Kysely({
			dialect: new PlanetScaleDialect({
				host: context.env.DATABASE_HOST,
				username: context.env.DATABASE_USERNAME,
				password: context.env.DATABASE_PASSWORD,
			}),
		}),
	}),
	mode: process.env.NODE_ENV,
})
