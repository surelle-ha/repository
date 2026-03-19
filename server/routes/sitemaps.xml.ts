import { useDb } from '../db/client'
import { projects } from '../db/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const siteUrl = (config.public.siteUrl as string || 'http://localhost:3000').replace(/\/$/, '')
    setHeader(event, 'Content-Type', 'application/xml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    let rows: { slug: string; updated_at: Date }[] = []

    try {
        const db = useDb()
        rows = await db
            .select({ slug: projects.slug, updated_at: projects.updated_at })
            .from(projects)
            .orderBy(asc(projects.sort_order))
    } catch {
        // Return a minimal sitemap if DB is unavailable
    }

    const toDate = (d: Date) => new Date(d).toISOString().split('T')[0]

    const urls = [
        // Static pages
        `
<url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
</url>`,
        `
<url>
    <loc>${siteUrl}/docs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
</url>`,
        // Dynamic project pages
        ...rows.map(r => `
<url>
    <loc>${siteUrl}/projects/${r.slug}</loc>
    <lastmod>${toDate(r.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
</url>`),
    ]

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('\n')}
</urlset>`
})