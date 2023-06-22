import type { DataFunctionArgs } from "@remix-run/cloudflare"
import { categorySlugs } from "~/utils/achievement.server"

export async function loader({ request, context }: DataFunctionArgs) {
	const origin = new URL(request.url).origin
	console.log(origin)

	function removeTrailingSlash(url: string) {
		return url.endsWith("/") ? url.slice(0, url.length - 1) : url
	}

	type SitemapUrlOption = {
		loc: string
		lastmod?: string
		changefreq?:
			| "always"
			| "hourly"
			| "daily"
			| "weekly"
			| "monthly"
			| "yearly"
			| "never"
		priority?: number
	}

	const staticUrls: SitemapUrlOption[] = [
		{ loc: "/", priority: 1 },
		{ loc: "/settings", priority: 0.64 },
		{ loc: "/settings/sessions", priority: 0.64 },
	].map((url) => ({ ...url, loc: `${origin}${removeTrailingSlash(url.loc)}` }))

	const categoryUrls: SitemapUrlOption[] = categorySlugs.map((slug) => {
		return {
			loc: `${origin}/category/${slug}`,
			priority: 0.8,
		}
	})

	function createSitemapUrls(urls: SitemapUrlOption[]) {
		function createUrlEntry({
			loc,
			lastmod,
			changefreq,
			priority,
		}: SitemapUrlOption) {
			return `
        <url>
            <loc>${loc}</loc>
            ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
            ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
            ${priority ? `<priority>${priority}</priority>` : ""}
        </url>
      `.trim()
		}

		return urls.map(createUrlEntry).join("")
	}

	const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ${createSitemapUrls([...staticUrls, ...categoryUrls])}
    </urlset>
  `.trim()

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml",
		},
	})
}
