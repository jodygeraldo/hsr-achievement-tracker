import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "~/utils/shared"

const buttonVariants = tv({
	base: "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-8 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1 disabled:cursor-not-allowed disabled:opacity-50",
	variants: {
		variant: {
			default:
				"bg-gold-3 text-gold-12 active:bg-gold-5 hover:enabled:bg-gold-4",
			destructive: "bg-red-9 text-white hover:enabled:bg-red-10",
			outline: "border border-gray-6 text-gray-12 hover:enabled:bg-gray-4",
			ghost: "text-gray-11 hover:enabled:bg-gray-4 hover:enabled:text-gray-12",
		},
		size: {
			default: "rounded-md px-3 py-2",
			sm: "rounded px-2 py-1",
			lg: "rounded-md px-3.5 py-2.5",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
})

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ className, variant, size, asChild = false, ...props },
	ref,
) {
	const Comp = asChild ? Slot : "button"
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	)
})

export { Button, buttonVariants }
