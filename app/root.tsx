import { DatabaseError } from "@planetscale/database"
import type {
	LinkDescriptor,
	LoaderArgs,
	SerializeFrom,
	V2_MetaDescriptor,
} from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { isRouteErrorResponse, useRouteError } from "@remix-run/react"
import type { Kysely } from "kysely"
import NProgress from "nprogress"
import { useGlobalPendingState } from "remix-utils"
import tailwindHref from "~/tailwind.css"
import { Document, Main } from "./components/_document"
import { getCategories } from "./models/achievement.server"
import type { AppSession, Database } from "./types"
import { getSessionId } from "./utils/session.server"
NProgress.configure({ showSpinner: false })

declare module "@remix-run/cloudflare" {
	export interface AppLoadContext {
		sessionStorage: AppSession
		db: Kysely<Database>
	}
}

export function meta(): V2_MetaDescriptor[] {
	return [{ title: "HSR Achievement Tracker" }]
}

export function links(): LinkDescriptor[] {
	return [
		{ rel: "preload", href: tailwindHref, as: "style" },
		{ rel: "stylesheet", href: tailwindHref },
	]
}

export type RootLoaderData = SerializeFrom<typeof loader>
export async function loader({ request, context }: LoaderArgs) {
	const sessionId = await getSessionId(context.sessionStorage, request)

	try {
		const category = await getCategories({
			db: context.db,
			sessionId,
		})

		return json(category)
	} catch (error) {
		let message = "Failed to get category details"
		if (error instanceof DatabaseError) {
			message = error.message
		}

		throw json({ message }, { status: 500 })
	}
}

export default function App() {
	const globalPendingState = useGlobalPendingState()
	if (globalPendingState === "pending") {
		NProgress.start()
	} else {
		NProgress.done()
	}

	return <Main />
}

export function ErrorBoundary() {
	const error = useRouteError()

	let errorMessage = "Unknown error"

	if (isRouteErrorResponse(error) && error.data.message) {
		errorMessage = error.data.message
	}

	if (error instanceof Error) {
		errorMessage = error.message
	}

	return (
		<Document>
			<div className="grid h-full place-items-center px-4 py-12 sm:px-6 lg:px-8">
				<div>
					<h1 className="text-7xl font-semibold text-gray-12">
						<span className="text-gold-9">500</span>{" "}
						<span className="text-3xl">Internal Server Error</span>
					</h1>

					<p className="mt-4 text-gray-11">{errorMessage}</p>
				</div>
			</div>
		</Document>
	)
}
