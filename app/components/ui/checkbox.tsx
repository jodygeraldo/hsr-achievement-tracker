import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as React from "react"
import { cn } from "~/utils/shared"
import { Svg15 } from "~/components/svg"

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(function Checkbox({ className, ...props }, ref) {
	return (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn(
				"peer h-5 w-5 shrink-0 rounded-md border border-gold-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8 data-[state=checked]:border-gold-8",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className={cn("flex items-center justify-center text-gold-9")}
			>
				<Svg15 name="check" className="h-4 w-4" aria-hidden="true" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
})

type CheckedState = CheckboxPrimitive.CheckedState
export type { CheckedState }
export { Checkbox }
