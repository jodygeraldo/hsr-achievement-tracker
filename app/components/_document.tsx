import {
	Links,
	LiveReload,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetcher,
	useLocation,
	useNavigate,
	useRouteLoaderData,
} from "@remix-run/react"
import * as React from "react"
import type { RootLoaderData } from "../root"
import { cn } from "../utils/shared"
import type { CheckedState } from "./ui/checkbox"
import { Checkbox } from "./ui/checkbox"

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full bg-gray-1 antialiased">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/assets/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/assets/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/assets/favicon-16x16.png"
				/>
				<link rel="manifest" href="/assets/site.webmanifest" />
				<Links />
			</head>
			<body className="h-full">
				{children}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

function Main() {
	return (
		<Document>
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-x-8 gap-y-4 lg:flex-row">
					<Sidebar />

					<Outlet />
				</div>

				<div className="mt-8 items-center justify-between sm:flex lg:hidden">
					<p className="text-sm text-gray-11">
						Unofficial{" "}
						<a
							href="https://hsr.hoyoverse.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-md underline decoration-gray-6 transition-colors hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
						>
							Honkai Star Rail
						</a>{" "}
						achievement tracker
					</p>

					<a
						href="https://github.com/jodygeraldo/hsr-achievement-tracker"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-md text-sm text-gray-11 underline decoration-gray-6 transition-colors hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
					>
						Open source on Github
					</a>
				</div>
			</div>
		</Document>
	)
}

function Sidebar() {
	const { achievementSize, achievedTotal, showMissedFirst } =
		useRouteLoaderData("root") as RootLoaderData

	const checkboxId = React.useId()

	const [showMissedFirstState, setShowMissedFirstState] =
		React.useState<CheckedState>(showMissedFirst)
	const fetcher = useFetcher()

	return (
		<div className="w-full self-start rounded-lg bg-gray-2 py-6 shadow-sm shadow-overlay-3 lg:sticky lg:top-12 lg:max-w-md">
			<div className="px-4">
				<h1 className="text-xl font-semibold tracking-tight text-gold-9">
					HSR Achievement Tracker
				</h1>

				<div className="mt-2 flex items-center justify-between tabular-nums">
					<div className="text-sm text-gray-12">
						<span className="font-medium">{achievedTotal}</span>/
						{achievementSize} &middot;{" "}
						<span className="font-medium">
							{achievedTotal === achievementSize
								? "100"
								: ((achievedTotal / achievementSize) * 100).toPrecision(2)}
							%
						</span>
					</div>

					<div className="flex items-center gap-x-2">
						<label
							htmlFor={checkboxId}
							className="select-none text-sm font-medium leading-none"
						>
							Show not achieved first
						</label>
						<Checkbox
							name="ck"
							id={checkboxId}
							checked={showMissedFirstState}
							onCheckedChange={(checked) => {
								setShowMissedFirstState(checked)
								if (checked !== "indeterminate") {
									fetcher.submit(
										{ checked: checked.toString() },
										{ action: "/", method: "POST", replace: true }
									)
								}
							}}
						/>
					</div>
				</div>
			</div>

			<div className="mt-8">
				<MobileNavigation />
				<DesktopNavigation />
			</div>

			<div className="mt-8 hidden items-center justify-between px-4 lg:block">
				<p className="text-sm text-gray-11">
					Unofficial{" "}
					<a
						href="https://hsr.hoyoverse.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-md underline decoration-gray-6 transition-colors hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
					>
						Honkai Star Rail
					</a>{" "}
					achievement tracker
				</p>

				<a
					href="https://github.com/jodygeraldo/hsr-achievement-tracker"
					target="_blank"
					rel="noopener noreferrer"
					className="mt-2 rounded-md text-sm text-gray-11 underline decoration-gray-6 transition-colors hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
				>
					Open source on Github
				</a>
			</div>
		</div>
	)
}

function DesktopNavigation() {
	const { categories } = useRouteLoaderData("root") as RootLoaderData

	return (
		<nav className="hidden sm:block">
			<ul className="space-y-1 px-2">
				{categories.map((category) => (
					<li key={category.slug}>
						<NavLink
							to={category.slug}
							prefetch="intent"
							className={({ isActive }) =>
								cn(
									isActive
										? "bg-gold-5 text-gold-12"
										: "text-gray-11 hover:bg-gray-4 hover:text-gray-12",
									"inline-flex w-full items-center justify-between rounded-md p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
								)
							}
						>
							<span className="text-sm font-medium">{category.name}</span>
							<div className="text-xs">
								{category.achievedCount}/{category.size}
							</div>
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	)
}

function MobileNavigation() {
	const { categories } = useRouteLoaderData("root") as RootLoaderData
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<div className="px-4 sm:hidden">
			<label htmlFor="navs" className="sr-only">
				Select a category
			</label>
			<select
				id="navs"
				name="navs"
				className="block w-full rounded-md border-0 bg-gray-3 py-1.5 pl-3 pr-10 text-gray-12 ring-1 ring-inset ring-gray-7 focus:ring-2 focus:ring-gold-8 sm:text-sm sm:leading-6"
				defaultValue={location.pathname}
				onChange={(e) => navigate(e.currentTarget.value)}
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

export { Document, Main }
