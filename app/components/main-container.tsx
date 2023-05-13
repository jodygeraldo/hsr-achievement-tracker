import * as React from "react"

export function MainContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full self-start rounded-lg bg-gray-2 px-4 py-6">
			{children}
		</div>
	)
}
