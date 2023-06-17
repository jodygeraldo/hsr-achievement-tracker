import * as React from "react"
import svg24Url from "~/assets/sprite/svg24.svg"
import svg15Url from "~/assets/sprite/svg15.svg"

export type Svg24Name = "home" | "setting"
export type Svg15Name =
	| "menu"
	| "cross"
	| "chevronDown"
	| "dotFilled"
	| "check"
	| "infoCircled"

function Svg24({
	name,
	...props
}: { name: Svg24Name } & React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<use href={`${svg24Url}#${name}`} />
		</svg>
	)
}

function Svg15({
	name,
	...props
}: { name: Svg15Name } & React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<use href={`${svg15Url}#${name}`} />
		</svg>
	)
}

export { Svg15, Svg24 }
