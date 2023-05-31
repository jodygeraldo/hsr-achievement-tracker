import {
	json,
	type DataFunctionArgs,
	type SerializeFrom,
	type V2_MetaArgs,
	type V2_MetaDescriptor,
} from "@remix-run/cloudflare"
import {
	isRouteErrorResponse,
	useLocation,
	useRouteError,
	useRouteLoaderData,
} from "@remix-run/react"
import { assert, string } from "superstruct"
import { AsideContainer, MainContainer } from "~/components/container"
import { ErrorComponent } from "~/components/error-component"
import { getAchievements, modifyAchieved } from "~/models/achievement.server"
import { type RootLoaderData } from "~/root"
import { isValidSlugifiedCategoryName } from "~/utils/achievement.server"
import { getActiveSessionId } from "~/utils/session.server"
import { loggingD1Error } from "~/utils/shared"
import { getUserPrefs } from "~/utils/user-prefs.server"
import { Achievement } from "./achievement"
import { AchievementHeader } from "./achievement-header"
import { AchievementLog } from "./achievement-log"

export function meta({
	data,
}: V2_MetaArgs<typeof loader>): V2_MetaDescriptor[] {
	const categoryName = data?.categoryName ?? "Page Not Found"
	return [{ title: `${categoryName} | HSR Achievement Tracker` }]
}

export async function action({ request, params, context }: DataFunctionArgs) {
	const slug = params.slug
	if (!isValidSlugifiedCategoryName(slug)) {
		throw json({ message: "Invalid slugified category name" }, { status: 400 })
	}

	const sessionId = await getActiveSessionId({
		sessionStorage: context.sessionStorage,
		request,
	})

	const formData = await request.formData()
	const name = formData.get("name")
	const intent = formData.get("intent")
	const path = formData.get("path")
	assert(name, string())

	try {
		switch (intent) {
			case "put":
			case "delete": {
				await modifyAchieved(context.db, { sessionId, slug, name, intent })
				break
			}
			case "multi": {
				assert(path, string())
				await modifyAchieved(context.db, {
					sessionId,
					slug,
					name,
					intent,
					path,
				})
				break
			}
			default:
				throw new Error("Invalid data intent on category.$slug/route action")
		}
	} catch (error) {
		console.error("routes/category.$slug/route.tsx|action")
		loggingD1Error(error)
		throw json(
			{ message: "Failed to modified achievement status" },
			{ status: 500 }
		)
	}

	return null
}

export type CategoryLoaderData = SerializeFrom<typeof loader>
export async function loader({ request, params, context }: DataFunctionArgs) {
	const slug = params.slug
	if (!isValidSlugifiedCategoryName(slug)) {
		throw json(
			{
				message:
					"The url you entered does not match any category. Please check the spelling and try again.",
			},
			{ status: 404 }
		)
	}

	const sessionId = await getActiveSessionId({
		sessionStorage: context.sessionStorage,
		request,
	})
	const userPrefs = await getUserPrefs(request)

	try {
		const data = await getAchievements(
			context.db,
			{
				sessionId,
				slug,
			},
			{ showMissedFirst: userPrefs.showMissedFirst }
		)

		return json({
			categoryName: data.categoryName,
			achievements: data.achievements,
			achieved: data.achieved,
			showClue: userPrefs.showClue,
		})
	} catch (error) {
		console.error("routes/category.$slug/route.tsx|loader")
		loggingD1Error(error)
		throw json(
			{ message: "Failed to get achievement details" },
			{ status: 500 }
		)
	}
}

export default function CategoryPage() {
	const location = useLocation()
	const { activeSession } = useRouteLoaderData("root") as RootLoaderData

	return (
		<>
			<MainContainer withAside>
				<AchievementHeader />
				<Achievement key={`${location.pathname}-${activeSession.id}`} />
			</MainContainer>

			<AsideContainer>
				<AchievementLog />
			</AsideContainer>
		</>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	let errorMessage = "Unknown error"

	if (isRouteErrorResponse(error)) {
		if (error.data.message) {
			errorMessage = error.data.message
		}

		if (error.status === 404) {
			return (
				<ErrorComponent
					status={404}
					title="Page Not Found"
					message={errorMessage}
				/>
			)
		}
	}

	if (error instanceof Error) {
		errorMessage = error.message
	}

	return (
		<ErrorComponent
			status={500}
			title="Internal Server Error"
			message={errorMessage}
		/>
	)
}
