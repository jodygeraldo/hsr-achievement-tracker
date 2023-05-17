import { DatabaseError } from "@planetscale/database"
import * as Popover from "@radix-ui/react-popover"
import * as Progress from "@radix-ui/react-progress"
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
	useParams,
	useRouteError,
	useRouteLoaderData,
} from "@remix-run/react"
import * as React from "react"
import { assert, is, literal, string, union } from "superstruct"
import { ErrorComponent } from "~/components/error-component"
import { MainContainer } from "~/components/main-container"
import type { CheckedState } from "~/components/ui/checkbox"
import { Checkbox } from "~/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio"
import type { Achievement as AchievementType } from "~/models/achievement.server"
import { getAchievements, modifyAchieved } from "~/models/achievement.server"
import type { RootLoaderData } from "~/root"
import { isValidSlugifiedCategoryName } from "~/utils/achievement.server"
import { getSessionId } from "~/utils/session.server"
import { cn } from "~/utils/shared"
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
	const path = formData.get("path")
	assert(name, string())

	try {
		if (is(intent, union([literal("put"), literal("delete")]))) {
			await modifyAchieved(context.db, sessionId, slug, name, intent)
		} else {
			assert(path, string())
			await modifyAchieved(context.db, sessionId, slug, name, "multi", path)
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
		const data = await getAchievements(
			context.db,
			sessionId,
			slug,
			userPrefs.showMissedFirst
		)

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
	const { achievements } = useLoaderData<typeof loader>()

	const slug = useParams().category
	const { categories } = useRouteLoaderData("root") as RootLoaderData
	const currentCategory = categories.find((category) => category.slug === slug)!

	const percentageToPerfect =
		100 - (Number(currentCategory.achievedCount) / currentCategory.size) * 100

	return (
		<MainContainer>
			<div className="sticky top-0 z-10 -mx-4 -mt-6 flex rounded-lg bg-gray-2 bg-opacity-75 px-4 py-6 backdrop-blur backdrop-filter">
				<Progress.Root
					value={Number(currentCategory.achievedCount)}
					max={currentCategory.size}
					className="relative h-5 w-full overflow-hidden rounded-full border border-gold-6 bg-gold-3"
					style={{
						// Fix overflow clipping in Safari
						// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
						transform: "translateZ(0)",
					}}
				>
					<Progress.Indicator
						className="h-full w-full bg-gold-9 transition-transform duration-700 ease-[0.7,0.3,0.3,0.6]"
						style={{
							transform: `translateX(-${percentageToPerfect}%)`,
						}}
					/>
				</Progress.Root>
			</div>

			<ul className="flex-1 divide-y divide-gray-6">
				{achievements.map((achievement) => (
					<li
						key={achievement.name.toString()}
						className="flex flex-col gap-x-8 gap-y-2 py-2 sm:flex-row sm:items-center sm:justify-between"
					>
						<div className="flex items-center gap-2 self-start sm:order-last">
							<span className="inline-flex items-center rounded-md bg-overlay-3 px-1.5 py-0.5 text-xs font-medium text-gray-11 ring-1 ring-inset ring-gray-6">
								{achievement.version}
							</span>

							{achievement.secret ? (
								<span className="inline-flex items-center rounded-md bg-overlay-3 px-1.5 py-0.5 text-xs font-medium text-gray-11 ring-1 ring-inset ring-gray-6 sm:order-first">
									Secret
								</span>
							) : null}
						</div>

						{Array.isArray(achievement.name) ? (
							<MultiAchievement achievement={achievement} />
						) : (
							<SingleAchievement achievement={achievement} />
						)}
					</li>
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

function MultiAchievement({ achievement }: { achievement: AchievementType }) {
	if (
		!Array.isArray(achievement.name) ||
		(achievement.clue && !Array.isArray(achievement.clue))
	) {
		throw new Error(
			"This is invalid definition for achievement, multi achievement should have an array of title and description"
		)
	}

	const { showClue } = useLoaderData<typeof loader>()
	const [value, setValue] = React.useState(achievement.path ?? "none")

	const fetcher = useFetcher()
	const action = useFormAction()

	const radioNoneId = React.useId()

	const displayClue =
		(!achievement.secret &&
			!achievement.path &&
			showClue.normalAchievement.beforeAchieved) ||
		(!achievement.secret &&
			achievement.path &&
			showClue.normalAchievement.afterAchieved) ||
		(achievement.secret &&
			!achievement.path &&
			showClue.secretAchievement.beforeAchieved) ||
		(achievement.secret &&
			achievement.path &&
			showClue.secretAchievement.afterAchieved)

	return (
		<RadioGroup
			value={value}
			onValueChange={(value) => {
				setValue(value)
				fetcher.submit(
					{
						name: achievement.name.toString(),
						path: value,
					},
					{ action, method: "POST", replace: true }
				)
			}}
			aria-label="Select an achievement"
		>
			<div className="flex items-center gap-x-3">
				<RadioGroupItem value="none" id={radioNoneId} />
				<label
					className="text-sm font-medium leading-6 text-gray-12"
					htmlFor={radioNoneId}
				>
					None
				</label>
			</div>

			{achievement.name.map((name, index) => (
				<div key={name} className="flex items-center gap-x-3">
					<RadioOrCheckboxContainer shouldRenderDiv={Boolean(displayClue)}>
						<RadioGroupItem value={name} id={name} />
					</RadioOrCheckboxContainer>

					<div className="text-sm leading-6">
						<label
							htmlFor={name}
							className={
								displayClue
									? cn(
											value === name
												? "text-gold-9 line-through"
												: "text-gray-12",
											"font-medium"
									  )
									: undefined
							}
						>
							{displayClue ? (
								name
							) : (
								<div className="flex items-center gap-2">
									<span
										className={cn(
											value === name
												? "text-gold-9 line-through"
												: "text-gray-12",
											"font-medium"
										)}
									>
										{name}
									</span>
									{achievement.clue &&
									achievement.clue[index] &&
									!displayClue ? (
										<AchievementClue clue={achievement.clue[index]} />
									) : null}
								</div>
							)}
						</label>

						{achievement.clue && achievement.clue[index] && displayClue ? (
							<p
								className="text-gray-11"
								dangerouslySetInnerHTML={{ __html: achievement.clue[index] }}
							/>
						) : null}
					</div>
				</div>
			))}
		</RadioGroup>
	)
}

function SingleAchievement({ achievement }: { achievement: AchievementType }) {
	if (
		typeof achievement.name !== "string" ||
		(achievement.clue && typeof achievement.clue !== "string")
	) {
		throw new Error(
			"This is invalid definition for achievement, single achievement should only have one title and one description"
		)
	}

	const { showClue } = useLoaderData<typeof loader>()
	const checkboxId = React.useId()
	const [checked, setChecked] = React.useState<CheckedState>(
		achievement.done ?? false
	)

	const fetcher = useFetcher()
	const action = useFormAction()

	const displayClue =
		(!achievement.secret &&
			!achievement.done &&
			showClue.normalAchievement.beforeAchieved) ||
		(!achievement.secret &&
			achievement.done &&
			showClue.normalAchievement.afterAchieved) ||
		(achievement.secret &&
			!achievement.done &&
			showClue.secretAchievement.beforeAchieved) ||
		(achievement.secret &&
			achievement.done &&
			showClue.secretAchievement.afterAchieved)

	return (
		<div key={achievement.name} className="flex items-center gap-x-3">
			<RadioOrCheckboxContainer shouldRenderDiv={Boolean(displayClue)}>
				<Checkbox
					name={achievement.name}
					id={checkboxId}
					checked={Boolean(checked)}
					onCheckedChange={(checked) => {
						setChecked(checked)
						if (checked !== "indeterminate") {
							fetcher.submit(
								{
									name: achievement.name.toString(),
									intent: checked ? "put" : "delete",
								},
								{ action, method: "POST", replace: true }
							)
						}
					}}
				/>
			</RadioOrCheckboxContainer>

			<div className="text-sm leading-6">
				<label htmlFor={checkboxId}>
					<div className="flex items-center gap-2">
						<span
							className={cn(
								checked ? "text-gold-9 line-through" : "text-gray-12",
								"font-medium"
							)}
						>
							{achievement.name}
						</span>
						{achievement.clue && !displayClue ? (
							<AchievementClue clue={achievement.clue} />
						) : null}
					</div>
				</label>

				{achievement.clue && displayClue ? (
					<p
						className="text-gray-11"
						dangerouslySetInnerHTML={{ __html: achievement.clue }}
					/>
				) : null}
			</div>
		</div>
	)
}

function RadioOrCheckboxContainer({
	shouldRenderDiv,
	children,
}: {
	shouldRenderDiv: boolean
	children: React.ReactNode
}) {
	if (shouldRenderDiv) {
		return <div className="flex h-6 items-center self-start">{children}</div>
	}

	return <>{children}</>
}

function AchievementClue({ clue }: { clue: string }) {
	return (
		<Popover.Root>
			<Popover.Trigger className="rounded-md text-gray-11 transition-colors hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8">
				<span className="sr-only">Clue</span>
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
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					side="top"
					sideOffset={4}
					className="z-50 max-w-[18rem] rounded-md bg-gray-3 p-2 text-sm text-gray-12 shadow-md shadow-overlay-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8"
					dangerouslySetInnerHTML={{
						__html: clue,
					}}
				/>
			</Popover.Portal>
		</Popover.Root>
	)
}
