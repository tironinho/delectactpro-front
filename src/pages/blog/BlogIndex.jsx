import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import SEOHead from '../../components/SEOHead.jsx'
import { articles, BLOG_CATEGORIES } from '../../content/blog/articles.js'
import { HUB_SLUGS, HUB_META } from '../../content/blog/hubs.js'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'updated', label: 'Recently updated' }
]

export default function BlogIndex() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sort, setSort] = useState('newest')

  const filteredAndSorted = useMemo(() => {
    let list = [...articles]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (a) =>
          (a.title || '').toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q) ||
          (a.keywords || []).some((k) => k.toLowerCase().includes(q))
      )
    }
    if (categoryFilter) list = list.filter((a) => a.category === categoryFilter)
    if (sort === 'newest') list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    if (sort === 'updated') list.sort((a, b) => new Date(b.updatedAt || b.publishedAt || 0) - new Date(a.updatedAt || a.publishedAt || 0))
    return list
  }, [search, categoryFilter, sort])

  const byCategory = useMemo(() => {
    const map = {}
    filteredAndSorted.forEach((a) => {
      if (!map[a.category]) map[a.category] = []
      map[a.category].push(a)
    })
    return map
  }, [filteredAndSorted])

  const categoryOrder = Object.keys(BLOG_CATEGORIES).filter((c) => byCategory[c]?.length)

  const startHereSlugs = ['data-broker-definition-sb362', 'drop-api-integration-guide', 'california-delete-act-compliance']
  const beforeAug2026Slugs = ['august-1-mandatory-deadline', 'enforcement-august-2026', 'sb362-45-day-deadline', 'readiness-score-dashboard']
  const startHere = articles.filter((a) => startHereSlugs.includes(a.slug))
  const beforeAug = articles.filter((a) => beforeAug2026Slugs.includes(a.slug))

  return (
    <main className="min-h-screen bg-slate-950">
      <SEOHead
        title="Blog — DROP Compliance Gateway"
        description="Technical briefs on SB 362, DROP API, cascading deletions, audit logs, and compliance automation."
        canonicalPath="/blog"
      />
      <Container className="py-16">
        <div className="mb-8">
          <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-slate-50">← Back to home</Link>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">Blog</h1>
        <p className="mt-2 text-slate-400">Technical briefs on DROP, SB 362, implementation, and compliance.</p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold text-slate-500 mb-2">Topic hubs — start here</div>
          <div className="flex flex-wrap gap-2">
            {HUB_SLUGS.map((slug) => {
              const meta = HUB_META[slug]
              const title = meta?.title || slug
              return (
                <Link
                  key={slug}
                  to={`/blog/${slug}`}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm font-medium text-slate-200 hover:border-regulatory-500/40 hover:bg-regulatory-500/10 hover:text-regulatory-200"
                >
                  {title}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <input
            type="search"
            placeholder="Search by title or keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100"
          >
            <option value="">All categories</option>
            {Object.entries(BLOG_CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {startHere.length > 0 && !search && !categoryFilter && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold tracking-wide text-regulatory-300">Start here</h2>
            <ul className="mt-4 space-y-3">
              {startHere.map((a) => (
                <li key={a.slug}>
                  <Link to={`/blog/${a.slug}`} className="block rounded-xl border border-regulatory-500/20 bg-regulatory-500/5 p-4 text-slate-200 hover:border-regulatory-500/40">
                    <span className="font-semibold text-slate-50">{a.title}</span>
                    <p className="mt-1 text-sm text-slate-400">{a.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {beforeAug.length > 0 && !search && !categoryFilter && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-wide text-amber-200/90">Most important before Aug 1, 2026</h2>
            <ul className="mt-4 space-y-3">
              {beforeAug.map((a) => (
                <li key={a.slug}>
                  <Link to={`/blog/${a.slug}`} className="block rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-200 hover:border-slate-700">
                    <span className="font-semibold text-slate-50">{a.title}</span>
                    <p className="mt-1 text-sm text-slate-400">{a.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-sm font-semibold tracking-wide text-slate-400">
            {search || categoryFilter ? `Results (${filteredAndSorted.length})` : 'All articles'}
          </h2>
          {categoryOrder.length === 0 ? (
            <p className="mt-4 text-slate-500">No articles match your filters.</p>
          ) : (
            <div className="mt-4 space-y-10">
              {categoryOrder.map((cat) => {
                const list = byCategory[cat] || []
                return (
                  <div key={cat}>
                    <h3 className="text-xs font-semibold text-regulatory-300">{BLOG_CATEGORIES[cat]}</h3>
                    <ul className="mt-3 space-y-3">
                      {list.map((a) => (
                        <li key={a.slug}>
                          <Link
                            to={`/blog/${a.slug}`}
                            className="block rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-200 hover:border-slate-700 hover:bg-slate-900/40"
                          >
                            <span className="font-semibold text-slate-50">{a.title}</span>
                            <p className="mt-1 text-sm text-slate-400">{a.description}</p>
                            <span className="mt-2 inline-block text-xs text-slate-500">{a.updatedAt || a.publishedAt}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <div className="text-sm font-semibold text-slate-50">Ready to automate?</div>
          <p className="mt-2 text-sm text-slate-300">Early Access is limited. Start with onboarding and one-command integration.</p>
          <div className="mt-4 flex gap-3">
            <a href="/#pricing" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">View pricing →</a>
            <Link to="/app/onboarding" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Go to onboarding →</Link>
          </div>
        </div>
      </Container>
    </main>
  )
}
