import clsx, { type ClassValue } from "clsx"
import { enums, is, string, type } from "superstruct"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
	return name
		.split(" ")
		.map((name) => name.charAt(0).toUpperCase())
		.filter((_, i, arr) => i === 0 || i === arr.length - 1)
		.join("")
}

export function loggingD1Error(error: unknown) {
	const D1ErrorStruct = type({
		message: enums([
			"D1_ERROR",
			"D1_TYPE_ERROR",
			"D1_COLUMN_NOTFOUND",
			"D1_DUMP_ERROR",
			"D1_EXEC_ERROR",
		]),
		cause: string(),
	})

	if (is(error, D1ErrorStruct)) {
		console.error(error.message)
		console.error(error.cause)
	}
}
