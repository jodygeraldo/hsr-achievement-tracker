import { DatabaseError } from "@planetscale/database"
import * as Popover from "@radix-ui/react-popover"
import type {
	ActionArgs,
	LoaderArgs,
	V2_MetaArgs,
	V2_MetaDescriptor,
} from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import type { ShouldRevalidateFunction } from "@remix-run/react"
import {
	isRouteErrorResponse,
	useFetcher,
	useFormAction,
	useLoaderData,
	useRouteError,
} from "@remix-run/react"
import * as React from "react"
import { assert, literal, string, union } from "superstruct"
import { ErrorComponent } from "~/components/error-component"
import { MainContainer } from "~/components/main-container"
import type { CheckedState } from "~/components/ui/checkbox"
import { Checkbox } from "~/components/ui/checkbox"
import type { Achievement as AchievementType } from "~/models/achievement.server"
import { getAchievements, modifyAchieved } from "~/models/achievement.server"
import { isValidSlugifiedCategoryName } from "~/utils/achievement.server"
import { getSessionId } from "~/utils/session.server"
import { getUserPrefs } from "~/utils/user-prefs.server"

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
	assert(name, string())
	assert(intent, union([literal("put"), literal("delete")]))

	try {
		await modifyAchieved(context.env, sessionId, slug, name, intent)
	} catch (error) {
		let message = "Failed to modified achievement status"
		if (error instanceof DatabaseError) {
			message = error.message
		}

		throw json({ message }, { status: 500 })
	}

	return null
}

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
	const { showMissedFirst } = await getUserPrefs(request)

	try {
		const data = await getAchievements(
			context.env,
			sessionId,
			slug,
			showMissedFirst
		)

		return json(data)
	} catch (error) {
		let message = "Failed to get achievement details"
		if (error instanceof DatabaseError) {
			message = error.message
		}

		throw json({ message }, { status: 500 })
	}
}

export default function CategoryPage() {
	const { achievements } = useLoaderData<typeof loader>()

	return (
		<MainContainer>
			<ul className="flex-1 divide-y divide-gray-6">
				{achievements.map((achievement) => (
					<Achievement key={achievement.name} achievement={achievement} />
				))}
			</ul>
		</MainContainer>
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

function Achievement({ achievement }: { achievement: AchievementType }) {
	const checkboxId = React.useId()
	const [checked, setChecked] = React.useState<CheckedState>(
		achievement.done ?? false
	)
	const fetcher = useFetcher()
	const action = useFormAction()

	return (
		<li className="flex items-center justify-between gap-x-8 py-2">
			<div key={achievement.name} className="flex items-center gap-x-3">
				<Checkbox
					name={achievement.name}
					id={checkboxId}
					checked={checked}
					onCheckedChange={(checked) => {
						setChecked(checked)
						if (checked !== "indeterminate") {
							fetcher.submit(
								{ name: achievement.name, intent: checked ? "put" : "delete" },
								{ action, method: "POST", replace: true }
							)
						}
					}}
				/>
				<label
					htmlFor={checkboxId}
					className="select-none text-sm text-gray-11 peer-data-[state=checked]:text-gold-11 peer-data-[state=checked]:line-through sm:text-base"
				>
					{achievement.name.includes("|DIVIDER|") ? (
						achievement.name.split("|DIVIDER|").map((text, idx) => (
							<div key={text} className="flex items-center gap-2">
								<span>{text}</span>
								{Array.isArray(achievement.clue) &&
								typeof achievement.clue[idx] !== "undefined" ? (
									<Popover.Root>
										<Popover.Trigger className="text-gray-11 transition-colors hover:text-gray-12">
											<span className="sr-only">Clue</span>
											<InfoCircle />
										</Popover.Trigger>

										<Popover.Portal>
											<Popover.Content
												side="top"
												sideOffset={4}
												className="z-50 max-w-[18rem] rounded-md bg-gray-3 p-2 text-sm text-gray-12 shadow-md shadow-overlay-6"
												dangerouslySetInnerHTML={{
													__html: achievement.clue[idx],
												}}
											/>
										</Popover.Portal>
									</Popover.Root>
								) : null}
							</div>
						))
					) : (
						<div className="flex items-center gap-2">
							<span>{achievement.name}</span>
							{achievement.clue && !Array.isArray(achievement.clue) ? (
								<Popover.Root>
									<Popover.Trigger className="rounded-md text-gray-11 transition-colors hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8">
										<span className="sr-only">Clue</span>
										<InfoCircle />
									</Popover.Trigger>

									<Popover.Portal>
										<Popover.Content
											side="top"
											sideOffset={4}
											className="z-50 max-w-[18rem] rounded-md bg-gray-3 p-2 text-sm text-gray-12 shadow-md shadow-overlay-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8"
											dangerouslySetInnerHTML={{
												__html: achievement.clue,
											}}
										/>
									</Popover.Portal>
								</Popover.Root>
							) : null}
						</div>
					)}
				</label>
			</div>

			<div className="flex items-center gap-2 self-start">
				{achievement.secret ? (
					<span className="inline-flex items-center rounded-md bg-overlay-3 px-1.5 py-0.5 text-xs font-medium text-gray-11 ring-1 ring-inset ring-gray-6">
						Secret
					</span>
				) : null}

				<span className="inline-flex items-center rounded-md bg-overlay-3 px-1.5 py-0.5 text-xs font-medium text-gray-11 ring-1 ring-inset ring-gray-6">
					{achievement.version}
				</span>
			</div>
		</li>
	)
}

function InfoCircle() {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4"
			aria-hidden={true}
		>
			<path
				d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
			/>
		</svg>
	)
}
