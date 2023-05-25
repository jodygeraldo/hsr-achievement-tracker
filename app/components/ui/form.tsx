import * as FormPrimitive from "@radix-ui/react-form"
import type { FormProps as RemixFormProps } from "@remix-run/react"
import { Form as RemixForm } from "@remix-run/react"
import * as React from "react"

type FormProps = {
	title: string
	description: string
} & Omit<FormPrimitive.FormProps & RemixFormProps, "asChild" | "className">

const FormField = FormPrimitive.Field
const FormControl = FormPrimitive.Control

function FormHeadless({
	children,
	...props
}: Omit<FormProps, "title" | "description">) {
	return (
		<FormPrimitive.Root {...props} asChild>
			<RemixForm>{children}</RemixForm>
		</FormPrimitive.Root>
	)
}

function Form({ title, description, children, ...props }: FormProps) {
	return (
		<FormPrimitive.Root {...props} asChild>
			<RemixForm className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
				<div>
					<h2 className="font-semibold leading-7 text-gray-12">{title}</h2>
					<p className="mt-1 text-sm leading-6 text-gray-11">{description}</p>
				</div>

				<div className="md:col-span-2">{children}</div>
			</RemixForm>
		</FormPrimitive.Root>
	)
}

function FormBody({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:max-w-xl">
			{children}
		</div>
	)
}

function FormActions({ children }: { children: React.ReactNode }) {
	return <div className="mt-8 flex items-center gap-x-6">{children}</div>
}

const FormLabel = React.forwardRef<
	React.ElementRef<typeof FormPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(function FormLabel({ children, ...props }, forwardedRef) {
	return (
		<FormPrimitive.Label
			ref={forwardedRef}
			className="block text-sm font-medium leading-6 text-gray-12"
			{...props}
		>
			{children}
		</FormPrimitive.Label>
	)
})

const FormSubmit = FormPrimitive.Submit

function FormMessage({ children, ...props }: FormPrimitive.FormMessageProps) {
	return (
		<FormPrimitive.Message {...props} className="mt-2 text-sm text-red-9">
			{children}
		</FormPrimitive.Message>
	)
}

export {
	FormHeadless,
	Form,
	FormBody,
	FormActions,
	FormField,
	FormLabel,
	FormControl,
	FormSubmit,
	FormMessage,
}
