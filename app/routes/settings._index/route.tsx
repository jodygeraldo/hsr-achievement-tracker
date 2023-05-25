import type { DataFunctionArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import * as React from "react"
import toast from "react-hot-toast"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
	Form,
	FormActions,
	FormBody,
	FormControl,
	FormField,
	FormLabel,
	FormSubmit,
} from "~/components/ui/form"
import { getUserPrefs, userPrefsCookie } from "~/utils/user-prefs.server"

export const handle = {
	pageHeading: "Settings",
}

export async function action({ request }: DataFunctionArgs) {
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

export async function loader({ request }: DataFunctionArgs) {
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

	const secretAfterAchievedHintId = React.useId()

	return (
		<Form
			method="POST"
			title="Description"
			description="These are the settings that determine how achievement descriptions are displayed."
		>
			<FormBody>
				<FormField
					name="showMissingFirst"
					className="col-span-full flex items-center gap-x-3"
				>
					<FormControl asChild>
						<Checkbox defaultChecked={showMissedFirst} />
					</FormControl>
					<FormLabel>Show not achieved first</FormLabel>
				</FormField>

				<fieldset className="col-span-full">
					<legend className="text-sm font-semibold leading-6 text-gray-12">
						Display descriptions for normal achievements
					</legend>
					<p className="mt-1 text-sm leading-6 text-gray-11">
						If unchecked, descriptions will be hidden and require a button click
						to reveal.
					</p>

					<div className="mt-6 space-y-6">
						<FormField
							name="normalBeforeAchieved"
							className="flex items-center gap-x-3"
						>
							<FormControl asChild>
								<Checkbox
									defaultChecked={showClue.normalAchievement.beforeAchieved}
								/>
							</FormControl>
							<FormLabel>Before achieved</FormLabel>
						</FormField>

						<FormField
							name="normalAfterAchieved"
							className="flex items-center gap-x-3"
						>
							<FormControl asChild>
								<Checkbox
									defaultChecked={showClue.normalAchievement.afterAchieved}
								/>
							</FormControl>
							<FormLabel>After achieved</FormLabel>
						</FormField>
					</div>
				</fieldset>

				<fieldset className="col-span-full">
					<legend className="text-sm font-semibold leading-6 text-gray-12">
						Display descriptions for secret achievements
					</legend>
					<p className="mt-1 text-sm leading-6 text-gray-11">
						If unchecked, descriptions will be hidden and require a button click
						to reveal.
					</p>

					<div className="mt-6 space-y-6">
						<FormField name="secretBeforeAchieved" className="flex gap-x-3">
							<div className="flex h-6 items-center">
								<FormControl asChild>
									<Checkbox
										defaultChecked={showClue.secretAchievement.beforeAchieved}
										aria-describedby={secretAfterAchievedHintId}
									/>
								</FormControl>
							</div>
							<div>
								<FormLabel>Before achieved</FormLabel>
								<p
									className="text-sm leading-6 text-gray-11"
									id={secretAfterAchievedHintId}
								>
									Checking this may reveal spoilers.
								</p>
							</div>
						</FormField>

						<FormField
							name="secretAfterAchieved"
							className="flex items-center gap-x-3"
						>
							<FormControl asChild>
								<Checkbox
									defaultChecked={showClue.secretAchievement.afterAchieved}
								/>
							</FormControl>
							<FormLabel>After achieved</FormLabel>
						</FormField>
					</div>
				</fieldset>

				<FormActions>
					<Button type="reset" variant="ghost">
						Reset
					</Button>
					<FormSubmit asChild>
						<Button>Save</Button>
					</FormSubmit>
				</FormActions>
			</FormBody>
		</Form>
	)
}
