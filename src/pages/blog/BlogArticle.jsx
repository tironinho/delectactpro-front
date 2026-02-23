import { useParams, Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import SEOHead from '../../components/SEOHead.jsx'
import JsonLd from '../../components/seo/JsonLd.jsx'
import { getSiteOrigin } from '../../utils/siteOrigin.js'
import { getArticleBySlug } from '../../content/blog/articles.js'

function readingTimeMinutes(article) {
  const sections = article?.bodySections || []
  let words = 0
  sections.forEach((s) => {
    if (s.type === 'paragraph') words += (s.content || '').split(/\s+/).length
    if (s.type === 'list' && Array.isArray(s.content)) s.content.forEach((c) => { words += String(c).split(/\s+/).length })
  })
  return Math.max(1, Math.ceil(words / 200))
}

export default function BlogArticle() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Container className="py-16">
          <p className="text-slate-400">Article not found.</p>
          <Link to="/blog" className="mt-4 inline-block text-regulatory-300 hover:text-regulatory-200">← Back to blog</Link>
        </Container>
      </main>
    )
  }

  const origin = getSiteOrigin()
  const url = `${origin}/blog/${article.slug}`
  const readingMin = article.readingTimeMinutes ?? readingTimeMinutes(article)
  const isTechnical = article.category === 'B'
  const isAudit = article.category === 'D'
  const isRisk = article.category === 'E' || article.category === 'F'

  return (
    <main className="min-h-screen bg-slate-950">
      <SEOHead
        title={`${article.title} — DROP Compliance Gateway`}
        description={article.description}
        keywords={article.keywords}
        canonicalPath={`/blog/${article.slug}`}
        ogType="article"
      />
      <JsonLd
        title={article.title}
        description={article.description}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        url={url}
        faqs={article.faqs || []}
        breadcrumbs={[
          { name: 'Blog', url: '/blog' },
          { name: article.title, url: `/blog/${article.slug}` }
        ]}
      />
      <Container className="py-16">
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link to="/blog" className="hover:text-slate-300">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-300 truncate max-w-[200px]">{article.title}</span>
        </nav>

        <article className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">{article.title}</h1>
          <p className="mt-4 text-lg text-slate-300">{article.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>Published {article.publishedAt}</span>
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <span>Last updated {article.updatedAt}</span>
            )}
            <span>{readingMin} min read</span>
          </div>

          <div className="mt-10 space-y-6 text-[15px] leading-7 text-slate-300">
            {(article.bodySections || []).map((section, i) => {
              if (section.type === 'paragraph') {
                return <p key={i}>{section.content}</p>
              }
              if (section.type === 'heading2') {
                return <h2 key={i} className="text-xl font-bold text-slate-50">{section.content}</h2>
              }
              if (section.type === 'list') {
                const items = Array.isArray(section.content) ? section.content : [section.content]
                return (
                  <ul key={i} className="list-disc space-y-2 pl-6">
                    {items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )
              }
              return null
            })}
          </div>

          {(article.internalLinks || []).length > 0 && (
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <div className="text-sm font-semibold text-slate-50">Related</div>
              <ul className="mt-3 space-y-2">
                {article.internalLinks.map((s) => (
                  <li key={s}>
                    <Link to={`/blog/${s}`} className="text-sm text-regulatory-300 hover:text-regulatory-200">
                      /blog/{s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(article.faqs) && article.faqs.length > 0 && (
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <div className="text-sm font-semibold text-slate-50">FAQ</div>
              <dl className="mt-4 space-y-3">
                {article.faqs.map((faq, i) => (
                  <div key={i}>
                    <dt className="font-medium text-slate-200">{faq.question}</dt>
                    <dd className="mt-1 text-sm text-slate-400">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <div className="text-sm font-semibold text-slate-50">
              {isTechnical && 'Book implementation / early access'}
              {isAudit && 'See audit-ready features'}
              {isRisk && 'Use the penalty calculator'}
              {!isTechnical && !isAudit && !isRisk && 'Want automation instead of firefighting?'}
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {isTechnical && 'Early Access is limited. Get onboarding and one-command integration.'}
              {isAudit && 'Immutable logs, audit packets, and exportable evidence for 2028 audits.'}
              {isRisk && 'Quantify exposure and penalty risk before mandatory enforcement.'}
              {!isTechnical && !isAudit && !isRisk && 'Early Access is limited. Quantify exposure and start implementation before enforcement.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <a href="/#pricing" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">View pricing →</a>
              <Link to="/app/onboarding" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Go to onboarding →</Link>
              {isRisk && (
                <Link to="/tools/penalty-calculator" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Penalty calculator →</Link>
              )}
              {isAudit && (
                <Link to="/app/audit-logs" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Audit logs →</Link>
              )}
            </div>
          </div>
        </article>
      </Container>
    </main>
  )
}
