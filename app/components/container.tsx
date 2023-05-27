import * as React from "react"
import { cn } from "~/utils/shared"

type MainContainerProps = {
	withAside?: boolean
	children: React.ReactNode
}

function MainContainer({ withAside, children }: MainContainerProps) {
	return (
		<main className="lg:pl-96">
			<div className={cn(withAside && "xl:pr-96")}>
				<div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
			</div>
		</main>
	)
}

function AsideContainer({ children }: { children: React.ReactNode }) {
	return (
		<aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-6 bg-gray-2 px-4 py-6 sm:px-6 lg:px-8 xl:block">
			{children}
		</aside>
	)
}

export { MainContainer, AsideContainer }
