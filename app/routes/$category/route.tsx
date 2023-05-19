import { DatabaseError } from "@planetscale/database"
import type {
	ActionArgs,
	LoaderArgs,
	SerializeFrom,
	V2_MetaArgs,
	V2_MetaDescriptor,
} from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import type { ShouldRevalidateFunction } from "@remix-run/react"
import { isRouteErrorResponse, useRouteError } from "@remix-run/react"
import { assert, is, literal, string, union } from "superstruct"
import { ErrorComponent } from "~/components/error-component"
import { getAchievements, modifyAchieved } from "~/models/achievement.server"
import { isValidSlugifiedCategoryName } from "~/utils/achievement.server"
import { getSessionId } from "~/utils/session.server"
import { getUserPrefs } from "~/utils/user-prefs.server"
import { Achievement } from "./achievement"
import { AchievementHeader } from "./achievement-header"

export function meta({
	data,
}: V2_MetaArgs<typeof loader>): V2_MetaDescriptor[] {
	const categoryName = data?.categoryName ?? "Page Not Found"
	return [{ title: `${categoryName} | HSR Achievement Tracker` }]
}

export async function action({ request, params, context }: ActionArgs) {
	const slug = params.category
	if (!isValidSlugifiedCategoryName(slug)) {
		throw json({ message: "Invalid slugified category name" }, { status: 400 })
	}

	const sessionId = await getSessionId(context.sessionStorage, request)

	const formData = await request.formData()
	const name = formData.get("name")
	const intent = formData.get("intent")
	const path = formData.get("path")
	assert(name, string())

	try {
		if (is(intent, union([literal("put"), literal("delete")]))) {
			await modifyAchieved({ db: context.db, sessionId, slug, name, intent })
		} else {
			assert(path, string())
			await modifyAchieved({
				db: context.db,
				sessionId,
				slug,
				name,
				intent: "multi",
				path,
			})
		}
	} catch (error) {
		let message = "Failed to modified achievement status"
		if (error instanceof DatabaseError) {
			message = error.message
		}

		throw json({ message }, { status: 500 })
	}

	return null
}

export type CategoryLoaderData = SerializeFrom<typeof loader>
export async function loader({ request, params, context }: LoaderArgs) {
	const slug = params.category
	if (!isValidSlugifiedCategoryName(slug)) {
		throw json(
			{
				message:
					"The url you entered does not match any category. Please check the spelling and try again.",
			},
			{ status: 404 }
		)
	}

	const sessionId = await getSessionId(context.sessionStorage, request)
	const userPrefs = await getUserPrefs(request)

	try {
		const data = await getAchievements({
			db: context.db,
			sessionId,
			slug,
			showMissedFirst: userPrefs.showMissedFirst,
		})

		return json({
			categoryName: data.categoryName,
			achievements: data.achievements,
			showClue: userPrefs.showClue,
		})
	} catch (error) {
		let message = "Failed to get achievement details"
		if (error instanceof DatabaseError) {
			message = error.message
		}

		throw json({ message }, { status: 500 })
	}
}

export default function CategoryPage() {
	return (
		<>
			<AchievementHeader />
			<Achievement />
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

export const shouldRevalidate: ShouldRevalidateFunction = ({
	formAction,
	formData,
}) => {
	if (formAction !== "/" && formData?.get("name")) {
		return false
	}

	return true
}
