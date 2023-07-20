import * as Dialog from "@radix-ui/react-dialog"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
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
	useMatches,
	useRouteLoaderData,
} from "@remix-run/react"
import * as React from "react"
import { Toaster } from "react-hot-toast"
import { type CategoryLoaderData } from "~/routes/category.$slug/route"
import { type RootLoaderData } from "~/root"
import { cn, getInitials } from "~/utils/shared"
import { Svg15, Svg24 } from "~/components/svg"

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full bg-gray-1 antialiased">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<meta
					name="description"
					content="Simple achievement tracker for Honkai Star Rail"
				/>
				<Meta />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<Links />
			</head>
			<body className="h-full">
				{children}
				<Toaster
					toastOptions={{
						style: {
							borderRadius: "0.375rem",
							background: "hsl(var(--gray-3))",
							color: "hsl(var(--gray-12))",
						},
						iconTheme: {
							primary: "hsl(var(--gold-9))",
							secondary: "hsl(var(--gold-12))",
						},
					}}
				/>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

function Main() {
	const location = useLocation()
	const matches = useMatches()
	const leafMatch = matches[matches.length - 1]

	const defaultPageHeading = "HSR Achievement Tracker"
	const pageHeading =
		(location.pathname.startsWith("/category")
			? (leafMatch.data as CategoryLoaderData | undefined)?.categoryName ??
			  defaultPageHeading
			: (leafMatch.handle?.pageHeading as string)) ?? defaultPageHeading

	const { activeSession } = useRouteLoaderData("root") as RootLoaderData

	return (
		<Document>
			<div>
				<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col">
					<Sidebar />
				</div>

				<Dialog.Root>
					<MobileSidebar />

					<div className="sticky top-0 z-10 flex items-center gap-x-6 border-b border-gray-6 bg-gray-2 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
						<Dialog.Trigger className="-m-2.5 p-2.5 text-gray-12 lg:hidden">
							<Svg15 name="menu" className="h-5 w-5" aria-hidden="true" />
							<span className="sr-only">Open sidebar</span>
						</Dialog.Trigger>

						<h1 className="flex-1 text-sm font-semibold leading-6 text-gray-12">
							{pageHeading}
						</h1>

						<DropdownMenu.Root modal={false}>
							<DropdownMenu.Trigger asChild>
								<button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-6 bg-gray-2 font-mono text-xs font-bold text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8">
									<span className="sr-only">{activeSession.name}</span>
									<span aria-hidden>{getInitials(activeSession.name)}</span>
								</button>
							</DropdownMenu.Trigger>

							<SessionMenu />
						</DropdownMenu.Root>
					</div>
				</Dialog.Root>

				<Outlet />
			</div>
		</Document>
	)
}

const navigation = [
	{ name: "Home", to: "/", icon: "home" },
	{ name: "Settings", to: "/settings", icon: "setting" },
] as const

function MobileSidebar() {
	return (
		<Dialog.Portal>
			<Dialog.Overlay className="fixed inset-0 z-20 bg-overlay-9 backdrop-blur backdrop-filter transition-opacity animate-in fade-in" />

			<div className="fixed inset-0 z-50 flex">
				<Dialog.Content className="relative flex w-full max-w-sm flex-1">
					<Sidebar />

					<Dialog.Close className="absolute right-4 top-4 flex justify-center text-gray-12">
						<Svg15 name="cross" aria-hidden="true" />
						<span className="sr-only">Close sidebar</span>
					</Dialog.Close>
				</Dialog.Content>
			</div>
		</Dialog.Portal>
	)
}

function Sidebar() {
	const { achievementSize, achievedTotal, categories, activeSession } =
		useRouteLoaderData("root") as RootLoaderData

	return (
		<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-6 bg-gray-2 px-6">
			<div className="flex h-16 shrink-0 items-center">
				<span className="text-lg font-semibold leading-none tracking-tight text-gold-9">
					HSR Achievement Tracker
				</span>
			</div>

			{/* Account */}
			<DropdownMenu.Root modal={false}>
				<DropdownMenu.Trigger disabled={!activeSession.id} asChild>
					<button className="group -mx-2 flex items-center gap-x-3 rounded-md bg-gray-3 p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8 hover:enabled:bg-gray-4 data-[state=open]:bg-gray-5">
						<div
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-gray-6 bg-gray-2 font-mono text-xl font-bold text-gray-12"
							aria-hidden="true"
						>
							{getInitials(activeSession.name)}
						</div>

						<div className="flex w-full flex-col self-stretch text-left">
							<div className="flex-1 text-sm font-medium text-gray-11">
								{activeSession.name}
							</div>

							<div className="text-sm text-gray-12">
								Completed <span className="font-medium">{achievedTotal}</span>{" "}
								out of <span className="font-medium">{achievementSize}</span>
							</div>
						</div>

						<Svg15
							name="chevronDown"
							className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180"
							aria-hidden="true"
						/>
					</button>
				</DropdownMenu.Trigger>

				<SessionMenu />
			</DropdownMenu.Root>

			<nav className="mb-8 flex flex-1 flex-col" aria-label="Sidebar">
				<ul className="flex flex-1 flex-col gap-y-3">
					<li>
						<ul className="-mx-2 space-y-1">
							{navigation.map((item) => (
								<li key={item.name}>
									<NavLink
										to={item.to}
										prefetch="intent"
										className={({ isActive }) =>
											cn(
												isActive
													? "bg-gray-5 text-gold-10"
													: "text-gray-11 hover:bg-gray-4 hover:text-gold-9",
												"flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8",
											)
										}
									>
										<Svg24
											name={item.icon}
											className="h-6 w-6 shrink-0"
											aria-hidden="true"
										/>
										{item.name}
									</NavLink>
								</li>
							))}
						</ul>
					</li>
					<li>
						<div className="text-xs font-semibold leading-6 text-gray-10">
							Categories
						</div>
						<ul className="-mx-2 mt-2 space-y-1">
							{categories.map((category) => (
								<li key={category.name}>
									<NavLink
										to={`/category/${category.slug}`}
										prefetch="intent"
										className={({ isActive }) =>
											cn(
												isActive
													? "bg-gray-5 text-gold-10"
													: "text-gray-11 hover:bg-gray-4 hover:text-gold-9",
												"flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8",
											)
										}
									>
										<img
											src={`/assets/${category.slug}.webp`}
											height={24}
											width={24}
											alt=""
											className="h-6 w-6 shrink-0 rounded-full bg-gold-9"
										/>

										<span className="truncate">{category.name}</span>

										<span
											className="ml-auto w-16 min-w-max whitespace-nowrap rounded-full bg-gray-2 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-12 ring-1 ring-inset ring-gray-6"
											aria-hidden="true"
										>
											{`${category.achievedCount}/${category.size}`}
										</span>
									</NavLink>
								</li>
							))}
						</ul>
					</li>
				</ul>
			</nav>

			{/* Disclaimer */}
			<div className="mb-4 mt-auto text-sm">
				<a
					href="https://github.com/jodygeraldo/hsr-achievement-tracker"
					target="_blank"
					rel="noopener noreferrer"
					className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
				>
					View open-source code on GitHub
				</a>

				<p className="text-gray-11">
					hsr.odlareg.dev is not associated with HoYoverse. All game content and
					materials are property of HoYoverse.
				</p>
			</div>
		</div>
	)
}

function SessionMenu() {
	const { sessions, activeSession } = useRouteLoaderData(
		"root",
	) as RootLoaderData
	const [activeId, setActiveId] = React.useState(activeSession.id)

	const fetcher = useFetcher()

	return (
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				sideOffset={4}
				align="end"
				className="z-50 min-w-[12rem] overflow-hidden rounded-md bg-gray-3 p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
			>
				<DropdownMenu.Label className="px-2 py-1.5 pl-8 text-xs font-semibold text-gray-11">
					Sessions
				</DropdownMenu.Label>

				<DropdownMenu.RadioGroup
					value={activeId}
					onValueChange={(value) => {
						setActiveId(value)
						fetcher.submit(
							{ id: value },
							{ action: "/resource/session", method: "POST", replace: true },
						)
					}}
					className="space-y-px"
				>
					{sessions.map((session) => (
						<DropdownMenu.RadioItem
							key={session.id}
							value={session.id}
							disabled={session.id === activeId}
							className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-gray-12 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:bg-gray-5 data-[highlighted]:bg-gray-4"
						>
							<DropdownMenu.ItemIndicator className="absolute left-2 flex items-center justify-center">
								<Svg15
									name="dotFilled"
									className="h-5 w-5 text-gold-8"
									aria-hidden="true"
								/>
							</DropdownMenu.ItemIndicator>

							{session.name}
						</DropdownMenu.RadioItem>
					))}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	)
}

export { Document, Main }
