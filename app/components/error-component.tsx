import { MainContainer } from "./container"

export type ErrorProps = {
	status: number
	title: string
	message: string
}

export function ErrorComponent({ status, title, message }: ErrorProps) {
	return (
		<MainContainer>
			<div>
				<h2 className="text-7xl font-semibold text-gray-12">
					<span className="text-gold-9">{status}</span>{" "}
					<span className="text-3xl">{title}</span>
				</h2>

				<p className="mt-4 text-gray-11">{message}</p>
			</div>
		</MainContainer>
	)
}
