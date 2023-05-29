import clsx, { type ClassValue } from "clsx"
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
