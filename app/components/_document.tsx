import * as Dialog from "@radix-ui/react-dialog"
import {
	Links,
	LiveReload,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
	useMatches,
	useRouteLoaderData,
} from "@remix-run/react"
import * as React from "react"
import { Toaster } from "react-hot-toast"
import type { CategoryLoaderData } from "~/routes/category.$slug/route"
import type { RootLoaderData } from "../root"
import { cn } from "../utils/shared"

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
				<Toaster />
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
	const pageHeading =
		(location.pathname.startsWith("/category")
			? (leafMatch.data as CategoryLoaderData).categoryName
			: (leafMatch.handle?.pageHeading as string)) ?? "HSR Achievement Tracker"

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
							<span className="sr-only">Open sidebar</span>
							<MenuIcon />
						</Dialog.Trigger>

						<h1 className="flex-1 text-sm font-semibold leading-6 text-gray-12">
							{pageHeading}
						</h1>

						<div
							className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-6 bg-gray-2 font-mono text-xs font-bold text-gray-12"
							aria-hidden="true"
						>
							A1
						</div>
					</div>
				</Dialog.Root>

				<Outlet />
			</div>
		</Document>
	)
}

const navigation = [
	{ name: "Home", to: "/", icon: HomeIcon },
	{ name: "Settings", to: "/settings", icon: SettingIcon },
]

function MobileSidebar() {
	return (
		<Dialog.Portal>
			<Dialog.Overlay className="fixed inset-0 z-20 bg-overlay-9 backdrop-blur backdrop-filter transition-opacity animate-in fade-in" />

			<div className="fixed inset-0 z-50 flex">
				<Dialog.Content className="relative flex w-full max-w-sm flex-1">
					<Sidebar />

					<Dialog.Close className="absolute right-4 top-4 flex justify-center text-gray-12">
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
								fill="currentColor"
								fillRule="evenodd"
								clipRule="evenodd"
							/>
						</svg>
					</Dialog.Close>
				</Dialog.Content>
			</div>
		</Dialog.Portal>
	)
}

function Sidebar() {
	const { achievementSize, achievedTotal, categories } = useRouteLoaderData(
		"root"
	) as RootLoaderData

	return (
		<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-6 bg-gray-2 px-6">
			<div className="flex h-16 shrink-0 items-center">
				<span className="text-lg font-semibold leading-none tracking-tight text-gold-9">
					HSR Achievement Tracker
				</span>
			</div>

			{/* Account */}
			<div className="-mx-2 flex gap-x-3 rounded-md bg-gray-3 p-2">
				<div
					className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-gray-6 bg-gray-2 font-mono text-xl font-bold text-gray-12"
					aria-hidden="true"
				>
					A1
				</div>

				<div className="flex w-full flex-col">
					<div className="flex-1 text-sm font-medium text-gray-11">
						Account 1
					</div>

					<div className="text-sm text-gray-12">
						Completed <span className="font-medium">{achievedTotal}</span> out
						of <span className="font-medium">{achievementSize}</span>
					</div>
				</div>
			</div>

			{/* Desktop Navigation */}
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
												"flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
											)
										}
									>
										<item.icon />
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
												"flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
											)
										}
									>
										<span className="truncate">{category.name}</span>

										<span
											className="ml-auto w-16 min-w-max whitespace-nowrap rounded-full bg-gray-3 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-12 ring-1 ring-inset ring-gray-6"
											aria-hidden="true"
										>
											{Number(category.achievedCount) === category.size
												? "🎉"
												: `${category.achievedCount}/${category.size}`}
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

function HomeIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6 shrink-0"
			aria-hidden="true"
		>
			<path
				opacity="0.12"
				d="M22 17V11.845C22 10.433 22 9.72701 21.8204 9.07517C21.6613 8.49771 21.3998 7.95353 21.0483 7.46857C20.6514 6.92115 20.1001 6.48011 18.9976 5.59805L16.9976 3.99805C15.214 2.57118 14.3222 1.85774 13.3332 1.58413C12.4608 1.34279 11.5392 1.34279 10.6668 1.58413C9.67783 1.85774 8.78603 2.57118 7.00244 3.99805L5.00244 5.59805C3.89986 6.48011 3.34857 6.92115 2.95174 7.46857C2.6002 7.95353 2.33865 8.49771 2.17957 9.07517C2 9.72701 2 10.433 2 11.845V17C2 19.7614 4.23858 22 7 22C8.10457 22 9 21.1046 9 20V15.9999C9 14.3431 10.3431 12.9999 12 12.9999C13.6569 12.9999 15 14.3431 15 15.9999V20C15 21.1046 15.8954 22 17 22C19.7614 22 22 19.7614 22 17Z"
				fill="#978365"
			/>
			<path
				d="M22 17V11.845C22 10.433 22 9.72701 21.8204 9.07517C21.6613 8.49771 21.3998 7.95353 21.0483 7.46857C20.6514 6.92115 20.1001 6.48011 18.9976 5.59805L16.9976 3.99805C15.214 2.57118 14.3222 1.85774 13.3332 1.58413C12.4608 1.34279 11.5392 1.34279 10.6668 1.58413C9.67783 1.85774 8.78603 2.57118 7.00244 3.99805L5.00244 5.59805C3.89986 6.48011 3.34857 6.92115 2.95174 7.46857C2.6002 7.95353 2.33865 8.49771 2.17957 9.07517C2 9.72701 2 10.433 2 11.845V17C2 19.7614 4.23858 22 7 22C8.10457 22 9 21.1046 9 20V15.9999C9 14.3431 10.3431 12.9999 12 12.9999C13.6569 12.9999 15 14.3431 15 15.9999V20C15 21.1046 15.8954 22 17 22C19.7614 22 22 19.7614 22 17Z"
				stroke="#978365"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function SettingIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6 shrink-0"
			aria-hidden="true"
		>
			<path
				opacity="0.12"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.59133 19.5624C1.90001 18.871 1.80981 17.7812 2.37808 16.9857L3.75798 15.0538C4.11531 14.5535 4.20724 13.919 4.10712 13.3125C4.03664 12.8854 3.99997 12.447 3.99997 11.9999C3.99997 11.553 4.03661 11.1147 4.10706 10.6878C4.20714 10.0812 4.1152 9.44678 3.75789 8.94655L2.37812 7.01487C1.80986 6.2193 1.90005 5.1295 2.59137 4.43818L4.43798 2.59157C5.1293 1.90025 6.2191 1.81006 7.01467 2.37832L8.94612 3.75793C9.44638 4.11526 10.0809 4.20719 10.6874 4.10708C11.1145 4.03659 11.5529 3.99993 12 3.99993C12.447 3.99993 12.8855 4.0366 13.3126 4.1071C13.9192 4.20723 14.5537 4.1153 15.054 3.75797L16.9852 2.37854C17.7808 1.81027 18.8706 1.90047 19.5619 2.59179L21.4085 4.4384C22.0998 5.12972 22.19 6.21952 21.6218 7.01509L20.2421 8.94665C19.8848 9.44686 19.7928 10.0813 19.8929 10.6878C19.9633 11.1147 20 11.5531 20 11.9999C20 12.4469 19.9633 12.8854 19.8928 13.3124C19.7927 13.919 19.8847 14.5535 20.242 15.0537L21.6218 16.9854C22.1901 17.781 22.0999 18.8708 21.4085 19.5621L19.5619 21.4087C18.8706 22.1001 17.7808 22.1903 16.9852 21.622L15.0533 20.242C14.5531 19.8847 13.9186 19.7928 13.3121 19.8928C12.8852 19.9633 12.4468 19.9999 12 19.9999C11.5531 19.9999 11.1149 19.9633 10.688 19.8929C10.0815 19.7928 9.44706 19.8848 8.94685 20.242L7.01462 21.6222C6.21905 22.1905 5.12926 22.1003 4.43793 21.409L2.59133 19.5624ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
				fill="#978365"
			/>
			<path
				d="M4.10712 13.3125C4.20724 13.919 4.11531 14.5535 3.75798 15.0538L2.37808 16.9857C1.80981 17.7812 1.90001 18.871 2.59133 19.5624L4.43793 21.409C5.12926 22.1003 6.21905 22.1905 7.01462 21.6222L8.94685 20.242C9.44706 19.8848 10.0815 19.7928 10.688 19.8929C11.1149 19.9633 11.5531 19.9999 12 19.9999C12.4468 19.9999 12.8852 19.9633 13.3121 19.8928C13.9186 19.7928 14.5531 19.8847 15.0533 20.242L16.9852 21.622C17.7808 22.1903 18.8706 22.1001 19.5619 21.4087L21.4085 19.5621C22.0999 18.8708 22.1901 17.781 21.6218 16.9854L20.242 15.0537C19.8847 14.5535 19.7927 13.919 19.8928 13.3124C19.9633 12.8854 20 12.4469 20 11.9999C20 11.5531 19.9633 11.1147 19.8929 10.6878C19.7928 10.0813 19.8848 9.44686 20.2421 8.94665L21.6218 7.01509C22.19 6.21952 22.0998 5.12972 21.4085 4.4384L19.5619 2.59179C18.8706 1.90047 17.7808 1.81027 16.9852 2.37854L15.054 3.75797C14.5537 4.1153 13.9192 4.20723 13.3126 4.1071C12.8855 4.0366 12.447 3.99993 12 3.99993C11.5529 3.99993 11.1145 4.03659 10.6874 4.10708C10.0809 4.20719 9.44638 4.11526 8.94612 3.75793L7.01467 2.37832C6.2191 1.81006 5.1293 1.90025 4.43798 2.59157L2.59137 4.43818C1.90005 5.1295 1.80986 6.2193 2.37812 7.01487L3.75789 8.94655C4.1152 9.44678 4.20714 10.0812 4.10706 10.6878C4.03661 11.1147 3.99997 11.553 3.99997 11.9999C3.99997 12.447 4.03664 12.8854 4.10712 13.3125Z"
				stroke="#978365"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
				stroke="#978365"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function MenuIcon() {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			aria-hidden="true"
		>
			<path
				d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
			></path>
		</svg>
	)
}

export { Document, Main }
