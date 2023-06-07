import { useLoaderData } from "@remix-run/react"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip"
import { type CategoryLoaderData } from "./route"

export function AchievementLog() {
	const { achieved } = useLoaderData() as CategoryLoaderData

	return (
		<TooltipProvider>
			<div>
				<h2 className="font-semibold leading-7 text-gray-12">
					Completion logs
				</h2>

				<ul className="mt-4 divide-y divide-gray-6">
					{achieved.map((ach) => (
						<li key={ach.name} className="flex items-center gap-x-3 py-2">
							<h3 className="flex-auto truncate text-sm font-semibold leading-6 text-gray-12">
								{ach.name}
							</h3>
							<Tooltip>
								<TooltipTrigger asChild>
									<time
										dateTime={ach.achievedAt.raw}
										className="flex-none text-xs text-gray-11"
									>
										{ach.achievedAt.formatted}
									</time>
								</TooltipTrigger>

								<TooltipContent>
									{Intl.DateTimeFormat("en", {
										dateStyle: "full",
										timeStyle: "medium",
									}).format(new Date(ach.achievedAt.raw))}
								</TooltipContent>
							</Tooltip>
						</li>
					))}
				</ul>
			</div>
		</TooltipProvider>
	)
}
