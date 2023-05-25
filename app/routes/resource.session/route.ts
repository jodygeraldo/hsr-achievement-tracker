import type { DataFunctionArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { getSessions } from "~/utils/session.server"

export async function loader({ request, context }: DataFunctionArgs) {
	const query = new URL(request.url).searchParams
	const id = query.get("id")

	const sessions = await getSessions({
		sessionStorage: context.sessionStorage,
		request,
	})

	const session = sessions.filter((session) => session.id === id)

	if (session.length !== 1) {
		throw json("You don't have permission to access this resource.", {
			status: 403,
		})
	}

	return json({ sessionId: session[0].sessionId })
}
