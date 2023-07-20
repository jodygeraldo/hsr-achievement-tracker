import { useLoaderData, useRouteLoaderData } from "@remix-run/react"
import { type RootLoaderData } from "~/root"
import { cn, getInitials } from "~/utils/shared"
import { type HomeLoaderData } from "./route"

export function Header() {
	const { achievedTotal, achievementSize, activeSession } = useRouteLoaderData(
		"root",
	) as RootLoaderData
	const { percentileRank, rank, currentVersion, secretAchieved } =
		useLoaderData() as HomeLoaderData

	const stats = [
		{
			name: "Completion rate",
			value:
				achievedTotal === 0
					? "0%"
					: `${((achievedTotal / achievementSize) * 100).toFixed(2)}%`,
		},
		{
			name: `Version ${currentVersion.num}`,
			value: currentVersion.achieved,
			unit: `/ ${currentVersion.size} achieved`,
		},
		{ name: "Found", value: secretAchieved, unit: "secrets" },
		{ name: "Rank", value: rank },
	]

	return (
		<header>
			<div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
				<div className="flex items-center gap-x-3">
					<div
						className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-gray-6 bg-gray-2 font-mono text-xl font-bold text-gray-12"
						aria-hidden="true"
					>
						{getInitials(activeSession.name)}
					</div>

					<h2 className="font-semibold leading-7 text-gray-12">
						{activeSession.name}
					</h2>
				</div>

				<div className="order-first flex-none rounded-full bg-gray-2 px-2.5 py-0.5 font-mono text-xs font-medium tabular-nums text-gray-12 ring-1 ring-inset ring-gold-8 sm:order-none">
					{percentileRank}
				</div>
			</div>

			<div className="grid grid-cols-1 bg-gray-3 sm:grid-cols-2 2xl:grid-cols-4">
				{stats.map((stat, statIdx) => (
					<div
						key={stat.name}
						className={cn(
							statIdx % 2 === 1
								? "sm:border-l"
								: statIdx === 2
								? "lg:border-l"
								: "",
							"border-t border-gray-6 px-4 py-6 sm:px-6 lg:px-8",
						)}
					>
						<p className="text-sm font-medium leading-6 text-gray-11">
							{stat.name}
						</p>
						<p className="mt-2 flex items-baseline gap-x-2">
							<span className="text-4xl font-semibold tracking-tight text-gray-12">
								{stat.value}
							</span>
							{stat.unit ? (
								<span className="text-sm text-gray-11">{stat.unit}</span>
							) : null}
						</p>
					</div>
				))}
			</div>
		</header>
	)
}
