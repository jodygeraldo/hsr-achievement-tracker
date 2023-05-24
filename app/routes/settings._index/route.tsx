import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
} from "@remix-run/react"
import * as React from "react"
import toast from "react-hot-toast"
import { Checkbox } from "~/components/ui/checkbox"
import { getUserPrefs, userPrefsCookie } from "~/utils/user-prefs.server"

export const handle = {
	pageHeading: "Settings",
}

export async function action({ request }: ActionArgs) {
	const cookie = await getUserPrefs(request)

	const formData = await request.formData()
	const showMissingFirst = formData.get("showMissingFirst") === "on"
	const normalBeforeAchieved = formData.get("normalBeforeAchieved") === "on"
	const normalAfterAchieved = formData.get("normalAfterAchieved") === "on"
	const secretBeforeAchieved = formData.get("secretBeforeAchieved") === "on"
	const secretAfterAchieved = formData.get("secretAfterAchieved") === "on"

	cookie.showMissedFirst = showMissingFirst
	cookie.showClue.normalAchievement.beforeAchieved = normalBeforeAchieved
	cookie.showClue.normalAchievement.afterAchieved = normalAfterAchieved
	cookie.showClue.secretAchievement.beforeAchieved = secretBeforeAchieved
	cookie.showClue.secretAchievement.afterAchieved = secretAfterAchieved

	return json(
		{ ok: true },
		{
			headers: {
				"Set-Cookie": await userPrefsCookie.serialize(cookie),
			},
		}
	)
}

export async function loader({ request }: LoaderArgs) {
	const userPrefs = await getUserPrefs(request)

	return json(userPrefs)
}

export default function SettingPage() {
	const { showMissedFirst, showClue } = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()

	React.useEffect(() => {
		if (navigation.state === "idle" && actionData?.ok) {
			toast.success("Your changes have been saved.", {
				id: "settingsAction",
				style: {
					borderRadius: "0.375rem",
					background: "hsl(var(--gray-3))",
					color: "hsl(var(--gray-12))",
				},
				iconTheme: {
					primary: "hsl(var(--gold-9))",
					secondary: "hsl(var(--gold-12))",
				},
			})
		}
	}, [actionData, navigation])

	return (
		<div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 lg:px-8 xl:grid-cols-3">
			<div>
				<h2 className="font-semibold leading-7 text-gray-12">Description</h2>
				<p className="mt-1 text-sm leading-6 text-gray-11">
					These are the settings that determine how achievement descriptions are
					displayed.
				</p>
			</div>

			<Form className="md:col-span-2" method="post">
				<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
					<div className="col-span-full flex items-center gap-x-3">
						<Checkbox
							id="show-missing-first"
							name="showMissingFirst"
							defaultChecked={showMissedFirst}
						/>
						<label
							htmlFor="show-missing-first"
							className="block text-sm font-medium leading-6 text-gray-12"
						>
							Show not achieved first
						</label>
					</div>

					<fieldset className="col-span-full">
						<legend className="text-sm font-semibold leading-6 text-gray-12">
							Display descriptions for normal achievements
						</legend>
						<p className="mt-1 text-sm leading-6 text-gray-11">
							If unchecked, descriptions will be hidden and require a button
							click to reveal.
						</p>

						<div className="mt-6 space-y-6">
							<div className="flex items-center gap-x-3">
								<Checkbox
									id="normal-before-achieved"
									name="normalBeforeAchieved"
									defaultChecked={showClue.normalAchievement.beforeAchieved}
								/>
								<label
									htmlFor="normal-before-achieved"
									className="block text-sm font-medium leading-6 text-gray-12"
								>
									Before achieved
								</label>
							</div>
							<div className="flex items-center gap-x-3">
								<Checkbox
									id="normal-after-achieved"
									name="normalAfterAchieved"
									defaultChecked={showClue.normalAchievement.afterAchieved}
								/>
								<label
									htmlFor="normal-after-achieved"
									className="block text-sm font-medium leading-6 text-gray-12"
								>
									After achieved
								</label>
							</div>
						</div>
					</fieldset>

					<fieldset className="col-span-full">
						<legend className="text-sm font-semibold leading-6 text-gray-12">
							Display descriptions for secret achievements
						</legend>
						<p className="mt-1 text-sm leading-6 text-gray-11">
							If unchecked, descriptions will be hidden and require a button
							click to reveal.
						</p>

						<div className="mt-6 space-y-6">
							<div className="flex gap-x-3">
								<div className="flex h-6 items-center">
									<Checkbox
										id="secret-before-achieved"
										name="secretBeforeAchieved"
										defaultChecked={showClue.secretAchievement.beforeAchieved}
									/>
								</div>
								<div className="text-sm leading-6">
									<label
										htmlFor="secret-before-achieved"
										className="font-medium text-gray-12"
									>
										Before achieved
									</label>
									<p className="text-gray-11">
										Checking this may reveal spoilers.
									</p>
								</div>
							</div>
							<div className="flex items-center gap-x-3">
								<Checkbox
									id="secret-after-achieved"
									name="secretAfterAchieved"
									defaultChecked={showClue.secretAchievement.afterAchieved}
								/>
								<label
									htmlFor="secret-after-achieved"
									className="block text-sm font-medium leading-6 text-gray-12"
								>
									After achieved
								</label>
							</div>
						</div>
					</fieldset>
				</div>

				<div className="mt-8 flex items-center gap-x-6">
					<button
						type="reset"
						className="rounded-md text-sm font-semibold leading-6 text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8"
					>
						Reset
					</button>
					<button
						type="submit"
						className="rounded-md bg-gold-3 px-3 py-2 text-sm font-semibold text-gray-12 shadow-sm hover:bg-gold-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-8"
					>
						Save
					</button>
				</div>
			</Form>

			{/* <form className="md:col-span-2">
					<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
						<div className="col-span-full">
							<label
								htmlFor="current-password"
								className="block text-sm font-medium leading-6 text-white"
							>
								Current password
							</label>
							<div className="mt-2">
								<input
									id="current-password"
									name="current_password"
									type="password"
									autoComplete="current-password"
									className="focus:ring-indigo-500 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="col-span-full">
							<label
								htmlFor="new-password"
								className="block text-sm font-medium leading-6 text-white"
							>
								New password
							</label>
							<div className="mt-2">
								<input
									id="new-password"
									name="new_password"
									type="password"
									autoComplete="new-password"
									className="focus:ring-indigo-500 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="col-span-full">
							<label
								htmlFor="confirm-password"
								className="block text-sm font-medium leading-6 text-white"
							>
								Confirm password
							</label>
							<div className="mt-2">
								<input
									id="confirm-password"
									name="confirm_password"
									type="password"
									autoComplete="new-password"
									className="focus:ring-indigo-500 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
				</form> */}
		</div>
	)
}
