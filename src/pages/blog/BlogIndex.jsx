import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import { articles, BLOG_CATEGORIES } from '../../content/blog/articles.js'

export default function BlogIndex() {
  const byCategory = {}
  articles.forEach((a) => {
    if (!byCategory[a.category]) byCategory[a.category] = []
    byCategory[a.category].push(a)
  })
  const categoryOrder = Object.keys(BLOG_CATEGORIES)

  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
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

        <div className="mt-10 space-y-10">
          {categoryOrder.map((cat) => {
            const list = byCategory[cat] || []
            if (list.length === 0) return null
            return (
              <section key={cat}>
                <h2 className="text-sm font-semibold tracking-wide text-regulatory-300">{BLOG_CATEGORIES[cat]}</h2>
                <ul className="mt-4 space-y-3">
                  {list.map((a) => (
                    <li key={a.slug}>
                      <Link
                        to={`/blog/${a.slug}`}
                        className="block rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-200 hover:border-slate-700 hover:bg-slate-900/40"
                      >
                        <span className="font-semibold text-slate-50">{a.title}</span>
                        <p className="mt-1 text-sm text-slate-400">{a.description}</p>
                        <span className="mt-2 inline-block text-xs text-slate-500">{a.publishedAt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

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
