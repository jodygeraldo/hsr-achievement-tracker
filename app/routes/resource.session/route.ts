import type { DataFunctionArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { assert, string } from "superstruct"
import { setActiveSession } from "~/models/sessions.server"
import { getSessions } from "~/utils/session.server"

export async function action({ request, context }: DataFunctionArgs) {
	const formData = await request.formData()
	const id = formData.get("id")
	assert(id, string())

	const cookieSession = await setActiveSession(
		{ sessionStorage: context.sessionStorage, request },
		id
	)

	if (!cookieSession) {
		throw json(
			{
				error: { id: "No session was found with the provided ID." },
			},
			{ status: 400 }
		)
	}

	return json(
		{ ok: true },
		{
			headers: {
				"Set-Cookie": await context.sessionStorage.commitSession(cookieSession),
			},
		}
	)
}

export async function loader({ request, context }: DataFunctionArgs) {
	const query = new URL(request.url).searchParams
	const id = query.get("id")
	assert(id, string())

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
