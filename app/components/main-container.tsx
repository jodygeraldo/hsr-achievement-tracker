import * as React from "react"

export function MainContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full self-start bg-gray-2 px-4 py-6 sm:rounded-lg">
			{children}
		</div>
	)
}
