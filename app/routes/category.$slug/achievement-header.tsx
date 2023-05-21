import * as Progress from "@radix-ui/react-progress"
import { useParams, useRouteLoaderData } from "@remix-run/react"
import type { RootLoaderData } from "~/root"

export function AchievementHeader() {
	const slug = useParams().slug
	const { categories } = useRouteLoaderData("root") as RootLoaderData
	const currentCategory = categories.find((category) => category.slug === slug)!

	const percentageToPerfect =
		100 - (Number(currentCategory.achievedCount) / currentCategory.size) * 100

	return (
		<div className="sticky top-[calc(4rem+1px)] z-10 -mx-4 -mt-6 flex flex-col gap-4 bg-opacity-75 px-4 py-6 backdrop-blur backdrop-filter sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-8 lg:px-8">
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
					className="h-full w-full bg-gold-9 transition duration-700 ease-[cubic-bezier(.7,.3,.3,.6)] data-[state=complete]:bg-gold-10"
					style={{
						transform: `translateX(-${percentageToPerfect}%)`,
					}}
				/>
			</Progress.Root>
		</div>
	)
}
