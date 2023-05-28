import { DatabaseError } from "@planetscale/database"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import * as Dialog from "@radix-ui/react-dialog"
import { json, type DataFunctionArgs } from "@remix-run/cloudflare"
import {
	useActionData,
	useFetcher,
	useFormAction,
	useLoaderData,
	useNavigation,
	useSubmit,
} from "@remix-run/react"
import * as React from "react"
import toast from "react-hot-toast"
import { assert, enums, string } from "superstruct"
import { Button } from "~/components/ui/button"
import {
	Form,
	FormActions,
	FormBody,
	FormControl,
	FormField,
	FormHeadless,
	FormLabel,
	FormMessage,
	FormSubmit,
} from "~/components/ui/form"
import {
	importSession,
	newSession,
	removeSession,
	updateSessionName,
} from "~/models/sessions.server"
import { type UserSession } from "~/types"
import { getSessions } from "~/utils/session.server"

export const handle = {
	pageHeading: "Settings",
}

export async function action({ request, context }: DataFunctionArgs) {
	const formData = await request.formData()
	const intent = formData.get("intent")
	assert(
		intent,
		enums(["updateSessionName", "removeSession", "newSession", "importSession"])
	)
	console.log(Object.fromEntries(formData.entries()))

	switch (intent) {
		case "newSession": {
			const name = formData.get("name")
			assert(name, string())

			const cookieSession = await newSession(
				{ sessionStorage: context.sessionStorage, request },
				name
			)

			if (!cookieSession) {
				return json(
					{
						intent,
						error: {
							name: "You have reached the maximum limit of 7 sessions.",
						},
					},
					{ status: 400 }
				)
			}

			return json(
				{ message: "Success! A new session has been created." },
				{
					headers: {
						"Set-Cookie": await context.sessionStorage.commitSession(
							cookieSession
						),
					},
				}
			)
		}

		case "importSession": {
			try {
				const name = formData.get("name")
				const sessionId = formData.get("sessionId")
				assert(name, string())
				assert(sessionId, string())

				const cookieSession = await importSession(
					{ sessionStorage: context.sessionStorage, db: context.db, request },
					{ name, sessionId }
				)

				if (!cookieSession) {
					return json(
						{
							intent,
							error: {
								sessionId:
									"No data is associated with this session ID. To create a new session, please use the new session form.",
							},
						},
						{ status: 400 }
					)
				}

				return json(
					{ message: "Success! The session has been imported successfully." },
					{
						headers: {
							"Set-Cookie": await context.sessionStorage.commitSession(
								cookieSession
							),
						},
					}
				)
			} catch (error) {
				let message = "Failed to import session"
				if (error instanceof DatabaseError) {
					message = error.message
				}

				throw json({ message }, { status: 500 })
			}
		}

		case "updateSessionName": {
			const id = formData.get("id")
			const newName = formData.get("newName")
			assert(id, string())
			assert(newName, string())

			const cookieSession = await updateSessionName(
				{ sessionStorage: context.sessionStorage, request },
				{ id, newName }
			)

			if (!cookieSession) {
				return json(
					{
						intent,
						error: { id: "No session was found with the provided ID." },
					},
					{ status: 400 }
				)
			}

			return json(
				{ message: "Success! The session name has been updated." },
				{
					headers: {
						"Set-Cookie": await context.sessionStorage.commitSession(
							cookieSession
						),
					},
				}
			)
		}

		case "removeSession": {
			console.log("run")

			const id = formData.get("id")
			assert(id, string())

			const cookieSession = await removeSession(
				{ sessionStorage: context.sessionStorage, request },
				id
			)

			if (!cookieSession) {
				return json(
					{
						intent,
						error: { id: "No session was found with the provided ID." },
					},
					{ status: 400 }
				)
			}

			return json(
				{ message: "Success! The session has been removed successfully." },
				{
					headers: {
						"Set-Cookie": await context.sessionStorage.commitSession(
							cookieSession
						),
					},
				}
			)
		}

		default:
			throw new Error("Invalid action intent happen on session setting page.")
	}
}

export async function loader({ request, context }: DataFunctionArgs) {
	const sessions = await getSessions({
		sessionStorage: context.sessionStorage,
		request,
	})

	return json({
		sessions: sessions.map((session) => ({
			id: session.id,
			name: session.name,
			sessionId: String("*").repeat(session.sessionId.length),
			isActive: session.isActive,
		})),
	})
}

export default function AccountSettingPage() {
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()

	React.useEffect(() => {
		if (
			navigation.state === "idle" &&
			actionData &&
			("message" in actionData ||
				("intent" in actionData && actionData.intent === "removeSession"))
		) {
			if ("message" in actionData) {
				toast.success(actionData.message, { id: "settingsAction" })
			}
			if ("intent" in actionData && actionData.intent === "removeSession") {
				toast.error(actionData.error.id, { id: "settingsAction" })
			}
		}
	}, [actionData, navigation])

	return (
		<div className="divide-y divide-gray-6">
			<SessionsForm />
			<NewSessionForm />
			<ImportSessionForm />
		</div>
	)
}

function SessionsForm() {
	const { sessions } = useLoaderData<typeof loader>()

	return (
		<div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
			<div>
				<h2 className="font-semibold leading-7 text-gray-12">Sessions</h2>
				<p className="mt-1 text-sm leading-6 text-gray-11">
					Be cautious when sharing your session ID on forms as it grants full
					access to your data.
				</p>
			</div>

			<div className="md:col-span-2">
				<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:max-w-xl">
					<div className="col-span-full flow-root">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 md:mx-0">
							<div className="inline-block min-w-full py-2 align-middle">
								<table className="min-w-full divide-y divide-gray-7">
									<thead>
										<tr className="bg-gray-3">
											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-12 sm:pl-6 md:rounded-tl-md lg:pl-8"
											>
												Name
											</th>
											<th
												scope="col"
												className="px-3 py-3.5 text-left text-sm font-semibold text-gray-12"
											>
												Session ID
											</th>
											<th
												scope="col"
												className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:rounded-tr-md lg:pr-8"
											>
												<span className="sr-only">Actions</span>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-6 bg-gray-2">
										{sessions.map((session) => (
											<SessionTableRow key={session.id} {...session} />
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function SessionTableRow({ id, name, sessionId, isActive }: UserSession) {
	const submit = useSubmit()
	const defaultAction = useFormAction()

	const [sessionIdText, setSessionIdText] = React.useState(sessionId)
	const isHidden = sessionIdText.startsWith("***")

	const fetcher = useFetcher<{ sessionId: string }>()
	React.useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data) {
			setSessionIdText(fetcher.data.sessionId)
		}
	}, [fetcher.data, fetcher.state])

	const navigation = useNavigation()
	const actionData = useActionData<typeof action>()
	const [serverUpdateError, setServerUpdateError] = React.useState<string>()

	React.useEffect(() => {
		if (
			navigation.state === "idle" &&
			actionData &&
			"intent" in actionData &&
			actionData.intent === "updateSessionName"
		) {
			setServerUpdateError(actionData.error.id)
		}
	}, [actionData, navigation])

	return (
		<tr key={id}>
			<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-12 sm:pl-6 lg:pl-8">
				{name}
			</td>

			<td className="whitespace-nowrap px-3 py-4">
				<div className="flex items-center gap-x-3">
					<div className="font-mono text-sm leading-6 text-gray-11">
						{sessionIdText}
					</div>
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={() =>
							isHidden
								? fetcher.submit(
										{ id },
										{ action: "/resource/session", replace: true }
								  )
								: setSessionIdText(sessionId)
						}
						className="focus-visible:ring-offset-gray-2"
					>
						{isHidden ? "Reveal" : "Hide"}
					</Button>
				</div>
			</td>

			<td className="relative whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 lg:pr-8">
				<div className="flex items-center justify-end gap-x-3">
					<Dialog.Root>
						<Dialog.Trigger asChild>
							<Button
								size="sm"
								variant="ghost"
								className="focus-visible:ring-offset-gray-2"
							>
								Edit
								<span className="sr-only">, {name}</span>
							</Button>
						</Dialog.Trigger>

						<Dialog.Portal>
							<div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
								<Dialog.Overlay className="fixed inset-0 z-50 bg-overlay-9 backdrop-blur backdrop-filter transition-opacity animate-in fade-in" />

								<Dialog.Content className="fixed z-50 grid w-full gap-4 rounded-b-lg bg-gray-3 p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0">
									<FormHeadless
										method="POST"
										onClearServerErrors={() => setServerUpdateError(undefined)}
									>
										<input type="hidden" name="id" value={id} />

										<div className="flex flex-col space-y-2 text-center sm:text-left">
											<Dialog.Title className="text-lg font-semibold text-gray-12">
												Update session name
											</Dialog.Title>

											<Dialog.Description className="text-sm text-gray-11">
												Enter a new name for the session to update it.
											</Dialog.Description>
										</div>

										<FormField
											name="newName"
											className="py-4"
											serverInvalid={Boolean(serverUpdateError)}
										>
											<FormLabel>Name</FormLabel>
											<div className="mt-2">
												<FormControl
													type="text"
													defaultValue={name}
													className="block w-full rounded-md border-0 bg-gray-3 py-1.5 text-gray-12 shadow-sm ring-1 ring-inset ring-gray-6 focus:ring-2 focus:ring-inset focus:ring-gold-8 sm:text-sm sm:leading-6"
													required
												/>
											</div>
											<div>
												<FormMessage match="valueMissing" />
											</div>
											{serverUpdateError ? (
												<FormMessage>{serverUpdateError}</FormMessage>
											) : null}
										</FormField>

										<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
											<FormSubmit
												name="intent"
												value="updateSessionName"
												asChild
											>
												<Button>Update</Button>
											</FormSubmit>
										</div>
									</FormHeadless>
								</Dialog.Content>
							</div>
						</Dialog.Portal>
					</Dialog.Root>

					<AlertDialog.Root>
						<AlertDialog.Trigger disabled={isActive} asChild>
							<Button
								size="sm"
								variant="ghost"
								className="focus-visible:ring-offset-gray-2"
							>
								Remove
								<span className="sr-only">, {name}</span>
							</Button>
						</AlertDialog.Trigger>

						<AlertDialog.Portal>
							<div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
								<AlertDialog.Overlay className="fixed inset-0 z-50 bg-overlay-9 backdrop-blur backdrop-filter transition-opacity animate-in fade-in" />

								<AlertDialog.Content className="fixed z-50 grid w-full max-w-lg scale-100 gap-4 bg-gray-3 p-6 opacity-100 shadow-lg animate-in fade-in-90 slide-in-from-bottom-10 sm:rounded-lg sm:zoom-in-90 sm:slide-in-from-bottom-0 md:w-full">
									<div className="flex flex-col space-y-2 text-center sm:text-left">
										<AlertDialog.Title className="text-lg font-semibold text-gray-12">
											Confirm session removal
										</AlertDialog.Title>

										<AlertDialog.Description className="text-sm text-gray-11">
											Are you sure you want to remove this session? Removing the
											session will result in loss of access to its data.
											However, you can still import the session again if you
											have the session ID.
										</AlertDialog.Description>
									</div>

									<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
										<AlertDialog.Cancel asChild>
											<Button variant="ghost">Cancel</Button>
										</AlertDialog.Cancel>

										<AlertDialog.Action asChild>
											<Button
												type="button"
												variant="destructive"
												onClick={() =>
													submit(
														{ id, intent: "removeSession" },
														{
															action: defaultAction,
															method: "POST",
															replace: true,
														}
													)
												}
											>
												Remove
											</Button>
										</AlertDialog.Action>
									</div>
								</AlertDialog.Content>
							</div>
						</AlertDialog.Portal>
					</AlertDialog.Root>
				</div>
			</td>
		</tr>
	)
}

function NewSessionForm() {
	const navigation = useNavigation()
	const actionData = useActionData<typeof action>()
	const [serverError, setServerError] = React.useState<string>()

	React.useEffect(() => {
		if (
			navigation.state === "idle" &&
			actionData &&
			"intent" in actionData &&
			actionData.intent === "newSession"
		) {
			setServerError(actionData.error.name)
		}
	}, [actionData, navigation])

	return (
		<Form
			method="POST"
			title="New session"
			description="Add a new session to track achievements for multiple accounts."
			onClearServerErrors={() => setServerError(undefined)}
		>
			<FormBody>
				<FormField
					name="name"
					className="col-span-full"
					serverInvalid={Boolean(serverError)}
				>
					<FormLabel>Name</FormLabel>
					<div className="mt-2">
						<FormControl
							type="text"
							className="block w-full rounded-md border-0 bg-gray-3 py-1.5 text-gray-12 shadow-sm ring-1 ring-inset ring-gray-6 focus:ring-2 focus:ring-inset focus:ring-gold-8 sm:text-sm sm:leading-6"
							required
						/>
					</div>
					<div>
						<FormMessage match="valueMissing" />
					</div>
					{serverError ? <FormMessage>{serverError}</FormMessage> : null}
				</FormField>
			</FormBody>

			<FormActions>
				<FormSubmit name="intent" value="newSession" asChild>
					<Button>Create</Button>
				</FormSubmit>
			</FormActions>
		</Form>
	)
}

function ImportSessionForm() {
	const navigation = useNavigation()
	const actionData = useActionData<typeof action>()
	const [serverError, setServerError] = React.useState<string>()

	React.useEffect(() => {
		if (
			navigation.state === "idle" &&
			actionData &&
			"intent" in actionData &&
			actionData.intent === "importSession"
		) {
			setServerError(actionData.error.sessionId)
		}
	}, [actionData, navigation])

	return (
		<Form
			method="POST"
			title="Import session"
			description="Import session from another browser or device."
			onClearServerErrors={() => setServerError(undefined)}
		>
			<FormBody>
				<FormField name="name" className="col-span-full">
					<FormLabel>Name</FormLabel>
					<div className="mt-2">
						<FormControl
							type="text"
							className="block w-full rounded-md border-0 bg-gray-3 py-1.5 text-gray-12 shadow-sm ring-1 ring-inset ring-gray-6 focus:ring-2 focus:ring-inset focus:ring-gold-8 sm:text-sm sm:leading-6"
							required
						/>
					</div>
					<FormMessage match="valueMissing" />
				</FormField>

				<FormField
					name="sessionId"
					className="col-span-full"
					serverInvalid={Boolean(serverError)}
				>
					<FormLabel>Session ID</FormLabel>
					<div className="mt-2">
						<FormControl
							type="text"
							className="block w-full rounded-md border-0 bg-gray-3 py-1.5 text-gray-12 shadow-sm ring-1 ring-inset ring-gray-6 focus:ring-2 focus:ring-inset focus:ring-gold-8 sm:text-sm sm:leading-6"
							required
						/>
					</div>
					<div>
						<FormMessage match="valueMissing" />
					</div>
					{serverError ? <FormMessage>{serverError}</FormMessage> : null}
				</FormField>
			</FormBody>

			<FormActions>
				<FormSubmit name="intent" value="importSession" asChild>
					<Button>Import</Button>
				</FormSubmit>
			</FormActions>
		</Form>
	)
}
