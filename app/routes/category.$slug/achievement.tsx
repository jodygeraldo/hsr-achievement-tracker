import * as Popover from "@radix-ui/react-popover"
import { useFetcher, useFormAction, useLoaderData } from "@remix-run/react"
import * as React from "react"
import { Checkbox } from "~/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio"
import { cn } from "~/utils/shared"
import type { CategoryLoaderData } from "./route"

export function Achievement() {
	const { achievements: loaderAchievements } =
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
						<Badge>{achievement.version}</Badge>
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

function Badge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-md bg-overlay-3 px-1.5 py-0.5 text-xs font-medium text-gray-11 ring-1 ring-inset ring-gray-6">
			{children}
		</span>
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
			"This is invalid definition for achievement, multi achievement should have an array of title and description"
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
			"This is invalid definition for achievement, single achievement should only have one title and one description"
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
