import * as Popover from "@radix-ui/react-popover"
import {
	useFetcher,
	useFormAction,
	useLoaderData,
	useRouteLoaderData,
} from "@remix-run/react"
import * as React from "react"
import { Badge } from "~/components/badge"
import { Checkbox } from "~/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio"
import { cn } from "~/utils/shared"
import { type CategoryLoaderData } from "./route"
import { type RootLoaderData } from "~/root"
import { Svg15 } from "~/components/svg"

export function Achievement() {
	const { achievements: loaderAchievements, currentVersion } =
		useLoaderData() as CategoryLoaderData
	const achievements = React.useRef(loaderAchievements)

	return (
		<ul className="flex-1 divide-y divide-gray-6">
			{achievements.current.map((achievement) => (
				<li
					key={achievement.name.toString()}
					className="flex flex-col gap-x-8 gap-y-2 py-2 sm:flex-row sm:items-center sm:justify-between"
				>
					<div className="flex items-center gap-2 self-start sm:order-last">
						<Badge
							className={cn(
								achievement.version === currentVersion && "ring-gold-6",
							)}
						>
							{achievement.version}
						</Badge>
						{achievement.isSecret ? <Badge>Secret</Badge> : null}
					</div>

					{Array.isArray(achievement.name) ? (
						<MultiAchievement achievement={achievement} />
					) : (
						<SingleAchievement achievement={achievement} />
					)}
				</li>
			))}
		</ul>
	)
}

function MultiAchievement({
	achievement,
}: {
	achievement: CategoryLoaderData["achievements"][number]
}) {
	if (
		!Array.isArray(achievement.name) ||
		(achievement.clue && !Array.isArray(achievement.clue))
	) {
		throw new Error(
			"This is invalid definition for achievement, multi achievement should have an array of title and description",
		)
	}

	const { showClue } = useLoaderData() as CategoryLoaderData
	const [value, setValue] = React.useState(achievement.path ?? "none")

	const fetcher = useFetcher()
	const action = useFormAction()

	const radioNoneId = React.useId()

	const displayClue = shouldDisplayClue({
		isSecret: achievement.isSecret,
		isAchieved: achievement.achievedAt,
		showClue,
	})

	const { activeSession } = useRouteLoaderData("root") as RootLoaderData

	return (
		<RadioGroup
			value={value}
			onValueChange={(value) => {
				setValue(value)
				fetcher.submit(
					{
						activeSessionId: activeSession.id,
						name: achievement.name.toString(),
						intent: value === "none" ? "delete" : "multi",
						path: value,
					},
					{ action, method: "POST", replace: true },
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
					<RadioOrCheckboxContainer shouldRenderDiv={displayClue}>
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
											"font-medium",
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
											"font-medium",
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

function SingleAchievement({
	achievement,
}: {
	achievement: CategoryLoaderData["achievements"][number]
}) {
	if (
		typeof achievement.name !== "string" ||
		(achievement.clue && typeof achievement.clue !== "string")
	) {
		throw new Error(
			"This is invalid definition for achievement, single achievement should only have one title and one description",
		)
	}

	const { showClue } = useLoaderData() as CategoryLoaderData
	const checkboxId = React.useId()
	const [checked, setChecked] = React.useState(Boolean(achievement.achievedAt))

	const fetcher = useFetcher()
	const action = useFormAction()

	const displayClue = shouldDisplayClue({
		isSecret: achievement.isSecret,
		isAchieved: achievement.achievedAt,
		showClue,
	})

	const { activeSession } = useRouteLoaderData("root") as RootLoaderData

	return (
		<div key={achievement.name} className="flex items-center gap-x-3">
			<RadioOrCheckboxContainer shouldRenderDiv={displayClue}>
				<Checkbox
					name={achievement.name}
					id={checkboxId}
					checked={checked}
					onCheckedChange={(checked) => {
						setChecked(Boolean(checked))
						if (checked !== "indeterminate") {
							fetcher.submit(
								{
									activeSessionId: activeSession.id,
									name: achievement.name.toString(),
									intent: checked ? "put" : "delete",
								},
								{ action, method: "POST", replace: true },
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
								"font-medium",
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
				<Svg15 name="infoCircled" className="h-4 w-4" aria-hidden="true" />
				<span className="sr-only">Clue</span>
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

function shouldDisplayClue({
	isSecret,
	isAchieved,
	showClue,
}: {
	isSecret?: boolean
	isAchieved?: string
	showClue: CategoryLoaderData["showClue"]
}) {
	if (isSecret) {
		if (isAchieved) {
			return showClue.secretAchievement.afterAchieved
		}

		return showClue.secretAchievement.beforeAchieved
	}

	if (isAchieved) {
		return showClue.normalAchievement.afterAchieved
	}

	return showClue.normalAchievement.beforeAchieved
}
