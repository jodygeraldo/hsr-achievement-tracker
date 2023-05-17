/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

interface Env {
	SESSION_SECRET: string
	DATABASE_HOST: string
	DATABASE_USERNAME: string
	DATABASE_PASSWORD: string
}
