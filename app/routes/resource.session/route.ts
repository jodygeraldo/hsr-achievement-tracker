import { json, type DataFunctionArgs } from "@remix-run/cloudflare"
import { assert, string } from "superstruct"
import { setActiveSession } from "~/models/sessions.server"
import { getSessionId } from "~/utils/session.server"

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

	if (!id) {
		throw json("id is required to access this resource.", {
			status: 400,
		})
	}

	const sessionId = await getSessionId(
		{ sessionStorage: context.sessionStorage, request },
		id
	)

	if (!sessionId) {
		throw json("You don't have permission to access this resource.", {
			status: 403,
		})
	}

	return json({ sessionId })
}
