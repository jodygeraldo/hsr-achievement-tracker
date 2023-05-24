import { NavLink, Outlet } from "@remix-run/react"
import { cn } from "~/utils/shared"

const settingTabs = [
	{ name: "Achievements", to: "." },
	// { name: "Account", to: "account" },
]

export default function SettingsLayout() {
	return (
		<main className="lg:pl-96">
			<header className="border-b border-gray-6">
				<nav className="flex overflow-x-auto py-4">
					<ul className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-11 sm:px-6 lg:px-8">
						{settingTabs.map((tab) => (
							<li key={tab.name}>
								<NavLink
									to={tab.to}
									className={({ isActive }) => cn(isActive && "text-gold-10")}
									end
								>
									{tab.name}
								</NavLink>
							</li>
						))}
					</ul>
				</nav>
			</header>

			<Outlet />
		</main>
	)
}
