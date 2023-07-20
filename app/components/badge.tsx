import * as React from "react"
import { cn } from "~/utils/shared"

export function Badge({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md bg-overlay-3 px-1.5 py-0.5 text-xs font-medium text-gray-11 ring-1 ring-inset ring-gray-6",
				className,
			)}
		>
			{children}
		</span>
	)
}
