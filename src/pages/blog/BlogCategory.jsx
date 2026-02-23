import { useParams, Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import SEOHead from '../../components/SEOHead.jsx'
import { BLOG_CATEGORIES, getCategoryKeyBySlug, getArticlesByCategory } from '../../content/blog/articles.js'

export default function BlogCategory() {
  const { categorySlug } = useParams()
  const categoryKey = getCategoryKeyBySlug(categorySlug)
  const categoryLabel = categoryKey ? BLOG_CATEGORIES[categoryKey] : null
  const list = categoryKey ? getArticlesByCategory(categoryKey) : []

  if (!categoryKey || !categoryLabel) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Container className="py-16">
          <p className="text-slate-400">Category not found.</p>
          <Link to="/blog" className="mt-4 inline-block text-regulatory-300 hover:text-regulatory-200">← Back to blog</Link>
        </Container>
      </main>
    )
  }

  const title = `${categoryLabel} — Blog | DROP Compliance Gateway`
  const description = `Articles on ${categoryLabel}. Technical briefs on DROP, SB 362, and compliance.`

  return (
    <main className="min-h-screen bg-slate-950">
      <SEOHead
        title={title}
        description={description}
        canonicalPath={`/blog/category/${categorySlug}`}
      />
      <Container className="py-16">
        <div className="mb-8">
          <Link to="/blog" className="text-sm font-semibold text-slate-400 hover:text-slate-50">← Back to blog</Link>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">{categoryLabel}</h1>
        <p className="mt-2 text-slate-400">Articles in this category</p>
        <ul className="mt-8 space-y-4">
          {list.map((a) => (
            <li key={a.slug}>
              <Link
                to={`/blog/${a.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-200 hover:border-slate-700 hover:bg-slate-900/40"
              >
                <span className="font-semibold text-slate-50">{a.title}</span>
                <p className="mt-1 text-sm text-slate-400">{a.description}</p>
                <span className="mt-2 inline-block text-xs text-slate-500">{a.updatedAt ?? a.publishedAt}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  )
}
