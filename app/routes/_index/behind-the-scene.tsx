import { Link } from "@remix-run/react"

export function BehindTheScene() {
	return (
		<>
			<h3 className="text-base font-semibold leading-7 text-gray-12">
				Behind the scenes
			</h3>
			<p className="mt-1 text-sm leading-6 text-gray-11">
				Learn about the inner workings of our app, including how it operates,
				how we handle data, issue reports, and how you can contribute to its
				development as an open-source project.
			</p>

			<div className="-mx-8 mt-6 border-t border-gray-6">
				<dl className="divide-y divide-gray-6">
					<div className="px-8 py-6">
						<dt className="text-sm font-medium leading-6 text-gray-12">
							How we handle your data
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-11">
							We use your browser's cookie storage to save your session ID and
							keep track of your achievements in our{" "}
							<a
								href="https://planetscale.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								PlanetScale
							</a>{" "}
							database. This allows you to use our app without logging in.
							However, if you clear your browser's session cookies, you will
							lose access to your data. To prevent this, make sure you know your
							session ID. You can find it on the{" "}
							<Link
								to="/settings/sessions"
								prefetch="intent"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								session settings page
							</Link>{" "}
							and import it again if needed.
						</dd>
					</div>

					<div className="px-8 py-6">
						<dt className="text-sm font-medium leading-6 text-gray-12">
							Open source
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-11">
							Our app is open source and available on{" "}
							<a
								href="https://github.com/jodygeraldo/hsr-achievement-tracker"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								GitHub
							</a>
							. Built with{" "}
							<a
								href="https://react.dev/"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								React
							</a>{" "}
							and{" "}
							<a
								href="https://remix.run/"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								Remix
							</a>
							.
						</dd>
					</div>

					<div className="px-8 py-6">
						<dt className="text-sm font-medium leading-6 text-gray-12">
							Get involved
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-11">
							We welcome contributions to our project. Report issues on{" "}
							<a
								href="https://github.com/jodygeraldo/hsr-achievement-tracker/issues"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								GitHub
							</a>
							, chat with us on Discord{" "}
							<span className="font-medium text-gray-12">(Odlareg#3358)</span>,
							or explore our codebase to see how you can get involved.
						</dd>
					</div>

					<div className="px-8 py-6">
						<dt className="text-sm font-medium leading-6 text-gray-12">
							Your privacy
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-11">
							We use cookies only for storing your settings preferences and
							session information. Your data is stored securely in our{" "}
							<a
								href="https://planetscale.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								PlanetScale
							</a>{" "}
							database. We use{" "}
							<a
								href="https://planetscale.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md text-sm text-gray-12 underline decoration-gray-7 transition-colors hover:decoration-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-8"
							>
								Cloudflare Web Analytics
							</a>
							, which provides privacy-first analytics.
						</dd>
					</div>
				</dl>
			</div>
		</>
	)
}
