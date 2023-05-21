import { useLoaderData } from "@remix-run/react"
import type { CategoryLoaderData } from "./route"

export function AchievementLog() {
	const { achieved } = useLoaderData() as CategoryLoaderData

	return (
		<div>
			<h2 className="font-semibold leading-7 text-gray-12">Completion logs</h2>

			<ul className="mt-4 divide-y divide-gray-6">
				{achieved.map((ach) => (
					<li key={ach.name} className="flex items-center gap-x-3 py-2">
						<h3 className="flex-auto truncate text-sm font-semibold leading-6 text-gray-11">
							{ach.name}
						</h3>
						<time
							dateTime={ach.achievedAt.raw}
							className="text-gray-600 flex-none text-xs"
							title={ach.achievedAt.raw}
						>
							{ach.achievedAt.formatted}
						</time>
					</li>
				))}
			</ul>
		</div>
	)
}
