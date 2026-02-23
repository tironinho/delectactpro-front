/**
 * Generates public/robots.txt, public/sitemap.xml (index), sitemap-pages.xml, sitemap-blog.xml.
 * Base URL: VITE_SITE_URL or SITEMAP_BASE_URL or https://deleteactpro.com
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const baseUrl = process.env.VITE_SITE_URL || process.env.SITEMAP_BASE_URL || 'https://deleteactpro.com'

const staticRoutes = [
  '/',
  '/blog',
  '/login',
  '/signup',
  '/tools/penalty-calculator',
  '/tools/drop-readiness-checklist',
  '/tools/data-broker-self-assessment',
  '/blog/category/sb362',
  '/blog/category/drop-api',
  '/blog/category/dsar-automation',
  '/blog/category/audits',
  '/blog/category/data-broker-compliance',
  '/solutions/data-brokers',
  '/use-cases/drop-api-readiness',
  '/pricing/setup-fee-early-access',
  '/compare/manual-vs-automated-delete-act-compliance'
]

// Blog slugs from content (single file or index)
const contentPaths = [
  path.join(root, 'src', 'content', 'blog', 'articles.js'),
  path.join(root, 'src', 'content', 'blog', 'index.js')
]
let blogSlugs = []
for (const contentPath of contentPaths) {
  try {
    const content = fs.readFileSync(contentPath, 'utf8')
    const slugRe = /slug:\s*['"]([^'"]+)['"]/g
    let m
    const seen = new Set(blogSlugs)
    while ((m = slugRe.exec(content)) !== null) {
      if (!seen.has(m[1])) {
        seen.add(m[1])
        blogSlugs.push(m[1])
      }
    }
  } catch (_) {}
}

const lastmod = new Date().toISOString().slice(0, 10)

// robots.txt
const robots = `User-agent: *
Allow: /
Allow: /blog
Allow: /blog/
Allow: /tools/
Allow: /login
Allow: /signup
Disallow: /app/
Disallow: /billing/success
Disallow: /billing/cancel

Sitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml
`
fs.mkdirSync(path.join(root, 'public'), { recursive: true })
fs.writeFileSync(path.join(root, 'public', 'robots.txt'), robots, 'utf8')
console.log('Wrote public/robots.txt')

// sitemap-pages.xml
const pagesUrls = staticRoutes.map((r) => ({ loc: r, priority: r === '/' ? '1.0' : '0.8', changefreq: 'weekly' }))
const sitemapPages = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesUrls.map((u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(root, 'public', 'sitemap-pages.xml'), sitemapPages, 'utf8')
console.log('Wrote public/sitemap-pages.xml with', pagesUrls.length, 'URLs')

// sitemap-blog.xml
const blogUrls = blogSlugs.map((slug) => ({ loc: `/blog/${slug}`, priority: '0.7', changefreq: 'monthly' }))
const sitemapBlog = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogUrls.map((u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(root, 'public', 'sitemap-blog.xml'), sitemapBlog, 'utf8')
console.log('Wrote public/sitemap-blog.xml with', blogUrls.length, 'URLs')

// sitemap.xml (index)
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>
`
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemapIndex, 'utf8')
console.log('Wrote public/sitemap.xml (index)')
