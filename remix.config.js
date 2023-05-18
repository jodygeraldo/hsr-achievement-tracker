/** @type {import('@remix-run/dev').AppConfig} */
export default {
	// devServerBroadcastDelay: 1000,
	ignoredRouteFiles: ["**/.*"],
	server: "./server.ts",
	serverBuildPath: "functions/[[path]].js",
	serverConditions: ["worker"],
	serverDependenciesToBundle: "all",
	serverMainFields: ["browser", "module", "main"],
	serverMinify: true,
	serverModuleFormat: "esm",
	serverPlatform: "neutral",
	// appDirectory: "app",
	// assetsBuildDirectory: "public/build",
	// publicPath: "/build/",
	future: {
		unstable_dev: true,
		v2_errorBoundary: true,
		v2_meta: true,
		v2_normalizeFormMethod: true,
		v2_routeConvention: true,
	},
	tailwind: true,
}
