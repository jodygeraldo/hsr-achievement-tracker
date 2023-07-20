import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as React from "react"
import { cn } from "~/utils/shared"
import { Svg15 } from "~/components/svg"

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
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<Svg15
					name="dotFilled"
					className="h-full w-full text-gold-8"
					aria-hidden="true"
				/>
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	)
})

export { RadioGroup, RadioGroupItem }
