/**
 * Generates public/sitemap.xml from static routes and blog articles.
 * Run: node scripts/generate-sitemap.mjs
 * Base URL from SITEMAP_BASE_URL env or https://dropcompliancegateway.example
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const baseUrl = process.env.SITEMAP_BASE_URL || 'https://dropcompliancegateway.example'

const staticRoutes = [
  '/',
  '/blog',
  '/login',
  '/signup',
  '/tools/penalty-calculator',
  '/tools/drop-readiness-checklist',
  '/tools/data-broker-self-assessment'
]

// Extract slugs from src/content/blog/articles.js (regex to avoid pulling in React)
const contentPath = path.join(root, 'src', 'content', 'blog', 'articles.js')
let blogSlugs = []
try {
  const content = fs.readFileSync(contentPath, 'utf8')
  const slugRe = /slug:\s*['"]([^'"]+)['"]/g
  let m
  const seen = new Set()
  while ((m = slugRe.exec(content)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1])
      blogSlugs.push(m[1])
    }
  }
} catch (e) {
  console.warn('Could not read articles.js:', e.message)
}

const urls = [
  ...staticRoutes.map((r) => ({ loc: r, priority: r === '/' ? '1.0' : '0.8', changefreq: 'weekly' })),
  ...blogSlugs.map((slug) => ({ loc: `/blog/${slug}`, priority: '0.7', changefreq: 'monthly' }))
]

const lastmod = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

const outPath = path.join(root, 'public', 'sitemap.xml')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, sitemap, 'utf8')
console.log('Wrote', outPath, 'with', urls.length, 'URLs')
