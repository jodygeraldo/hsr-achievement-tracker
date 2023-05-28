import {
	json,
	type DataFunctionArgs,
	type SerializeFrom,
} from "@remix-run/cloudflare"
import { AsideContainer, MainContainer } from "~/components/container"
import { getHomeAchievementData } from "~/models/achievement.server"
import { getActiveSessionId } from "~/utils/session.server"
import { BehindTheScene } from "./behind-the-scene"
import { Header } from "./header"
import { LatestAchieved } from "./latest-achieved"

export type HomeLoaderData = SerializeFrom<typeof loader>
export async function loader({ request, context }: DataFunctionArgs) {
	const sessionId = await getActiveSessionId({
		sessionStorage: context.sessionStorage,
		request,
	})

	const data = await getHomeAchievementData(context.db, { sessionId })

	return json(data)
}

export default function HomePage() {
	return (
		<>
			<MainContainer withAside withPaddings={false}>
				<Header />
				<LatestAchieved />
			</MainContainer>

			<AsideContainer>
				<BehindTheScene />
			</AsideContainer>
		</>
	)
}
