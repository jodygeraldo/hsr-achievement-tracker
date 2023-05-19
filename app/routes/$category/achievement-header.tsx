import * as Progress from "@radix-ui/react-progress"
import {
	useLocation,
	useNavigate,
	useParams,
	useRouteLoaderData,
} from "@remix-run/react"
import type { RootLoaderData } from "~/root"

export function AchievementHeader() {
	return (
		<div className="sticky top-0 z-10 -mx-4 -mt-12 flex flex-col gap-4 bg-gray-2 bg-opacity-75 px-4 py-6 backdrop-blur backdrop-filter sm:-mt-6 sm:rounded-lg">
			<AchievementMobileNavigation />
			<AchievementProgress />
		</div>
	)
}

function AchievementMobileNavigation() {
	const { categories } = useRouteLoaderData("root") as RootLoaderData

	const location = useLocation()
	const navigate = useNavigate()

	return (
		<div className="sm:hidden">
			<label htmlFor="navs" className="sr-only">
				Select a category
			</label>
			<select
				id="navs"
				className="block w-full rounded-md border-0 bg-gray-3 py-1.5 pl-3 pr-10 text-gray-12 ring-1 ring-inset ring-gray-7 focus:ring-2 focus:ring-gold-8 sm:text-sm sm:leading-6"
				defaultValue={location.pathname.slice(1)}
				onChange={(e) => navigate(`/${e.currentTarget.value}`)}
			>
				{categories.map((category) => (
					<option key={category.slug} value={category.slug}>
						{category.name}
					</option>
				))}
			</select>
		</div>
	)
}

function AchievementProgress() {
	const slug = useParams().category
	const { categories } = useRouteLoaderData("root") as RootLoaderData
	const currentCategory = categories.find((category) => category.slug === slug)!

	const percentageToPerfect =
		100 - (Number(currentCategory.achievedCount) / currentCategory.size) * 100

	return (
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
	)
}
