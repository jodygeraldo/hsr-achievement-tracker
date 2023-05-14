import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as React from "react"
import { cn } from "~/utils/shared"

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-2", className)}
			{...props}
			ref={ref}
		/>
	)
})

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(function RadioGroupItem({ className, children, ...props }, ref) {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				"h-5 w-5 shrink-0 rounded-full border border-gold-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8 data-[state=checked]:border-gold-8",
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full text-gold-11"
				>
					<path
						d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
						fill="currentColor"
					/>
				</svg>
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	)
})

export { RadioGroup, RadioGroupItem }
