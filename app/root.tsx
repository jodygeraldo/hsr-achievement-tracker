import { DatabaseError, type Connection } from "@planetscale/database"
import {
	json,
	type LinkDescriptor,
	type LoaderArgs,
	type SerializeFrom,
	type V2_MetaDescriptor,
} from "@remix-run/cloudflare"
import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react"
import tailwindHref from "~/tailwind.css"
import { Document, Main } from "./components/_document"
import { getCategories } from "./models/achievement.server"
import { type AppSessionStorage } from "./types"
import { getSessions, setupSession } from "./utils/session.server"

declare module "@remix-run/cloudflare" {
	export interface AppLoadContext {
		sessionStorage: AppSessionStorage
		db: Connection
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
	await setupSession({
		sessionStorage: context.sessionStorage,
		request,
	})

	const sessions = await getSessions({
		sessionStorage: context.sessionStorage,
		request,
	})
	const activeSession = sessions.filter((session) => session.isActive)[0]

	try {
		const category = await getCategories(context.db, {
			sessionId: activeSession.sessionId,
		})

		return json({
			...category,
			activeSession: { id: activeSession.id, name: activeSession.name },
			sessions: sessions.map((session) => ({
				id: session.id,
				name: session.name,
				isActive: session.isActive,
			})),
		})
	} catch (error) {
		console.error(error)
		let message = "Failed to get category details"
		if (error instanceof DatabaseError) {
			message = error.message
		}

		throw json({ message }, { status: 500 })
	}
}

export default function App() {
	return <Main />
}

export function ErrorBoundary() {
	const error = useRouteError()

	let errorMessage = "Unknown error"

	if (isRouteErrorResponse(error)) {
		if (typeof error.data === "string") {
			errorMessage = error.data
		}

		if (error.data.message) {
			errorMessage = error.data.message
		}

		if (error.status === 404) {
			return (
				<Document>
					<div className="grid h-full place-items-center px-4 py-12 sm:px-6 lg:px-8">
						<div>
							<h1 className="text-7xl font-semibold text-gray-12">
								<span className="text-gold-9">404</span>{" "}
								<span className="text-3xl">Page Not Found</span>
							</h1>

							<p className="mt-4 text-gray-11">{errorMessage}</p>

							<Link
								to="/"
								prefetch="intent"
								className="rounded-md text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								Back home
							</Link>
						</div>
					</div>
				</Document>
			)
		}
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
