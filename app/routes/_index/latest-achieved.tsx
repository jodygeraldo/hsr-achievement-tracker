import { useLoaderData } from "@remix-run/react"
import { Badge } from "~/components/badge"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip"
import { type HomeLoaderData } from "./route"

export function LatestAchieved() {
	const { latestAchieved } = useLoaderData() as HomeLoaderData

	return (
		<TooltipProvider>
			<div className="border-t border-gray-6 pt-11">
				<h2 className="px-4 font-semibold leading-7 text-gray-12 sm:px-6 lg:px-8">
					Latest achieved
				</h2>

				<ul className="divide-y divide-gray-6">
					{latestAchieved.map((achieved) => (
						<li key={achieved.name} className="px-4 py-4 sm:px-6 lg:px-8">
							<div className="flex items-center gap-x-3">
								<img
									src={`/assets/${achieved.slug}.webp`}
									alt={achieved.slug.split("-").join(" ")}
									className="h-6 w-6 shrink-0 rounded-full bg-gold-9"
								/>
								<h3 className="flex-auto truncate text-sm font-semibold leading-6 text-gray-12">
									{achieved.name}
								</h3>

								<Tooltip>
									<TooltipTrigger asChild>
										<time
											dateTime={achieved.achievedAt.raw}
											className="flex-none text-xs text-gray-11"
										>
											{achieved.achievedAt.formatted}
										</time>
									</TooltipTrigger>

									<TooltipContent>
										{Intl.DateTimeFormat("en", {
											dateStyle: "full",
											timeStyle: "medium",
										}).format(new Date(achieved.achievedAt.raw))}
									</TooltipContent>
								</Tooltip>
							</div>

							<div className="mt-2 flex items-center gap-x-1.5">
								<Badge>{achieved.category}</Badge>
								<Badge>{achieved.version}</Badge>
								{achieved.isSecret ? <Badge>Secret</Badge> : null}
							</div>
						</li>
					))}
				</ul>
			</div>
		</TooltipProvider>
	)
}
