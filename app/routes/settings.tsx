import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { Form, useLoaderData } from "@remix-run/react"
import { Checkbox } from "~/components/ui/checkbox"
import { getUserPrefs, userPrefsCookie } from "~/utils/user-prefs.server"

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

	return json(null, {
		headers: {
			"Set-Cookie": await userPrefsCookie.serialize(cookie),
		},
	})
}

export async function loader({ request }: LoaderArgs) {
	const userPrefs = await getUserPrefs(request)

	return json(userPrefs)
}

export default function SettingsPage() {
	const { showMissedFirst, showClue } = useLoaderData<typeof loader>()

	return (
		<Form method="post">
			<div className="space-y-12">
				<div className="border-b border-gray-6 pb-12">
					<h2 className="font-semibold leading-7 text-gray-12">General</h2>
					<p className="mt-1 text-sm leading-6 text-gray-11">
						These are the settings that determine how achievements are displayed
					</p>

					<div className="mt-10 space-y-10">
						<div className="flex items-center gap-x-3">
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

						<fieldset>
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
						<fieldset>
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
				</div>
			</div>

			<div className="mt-6 flex items-center justify-end gap-x-6">
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
	)
}
