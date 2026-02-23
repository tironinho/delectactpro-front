import { useParams, Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import JsonLd from '../../components/seo/JsonLd.jsx'
import { getArticleBySlug } from '../../content/blog/articles.js'

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

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/blog/${article.slug}`

  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title={`${article.title} — DROP Compliance Gateway`}
        description={article.description}
        canonicalPath={`/blog/${article.slug}`}
      />
      <JsonLd
        title={article.title}
        description={article.description}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        url={url}
        faqs={article.faqs || []}
      />
      <Container className="py-16">
        <div className="mb-8">
          <Link to="/blog" className="text-sm font-semibold text-slate-400 hover:text-slate-50">← Back to blog</Link>
        </div>

        <article className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">{article.title}</h1>
          <p className="mt-4 text-lg text-slate-300">{article.description}</p>
          <div className="mt-4 text-xs text-slate-500">
            {article.publishedAt}
            {article.updatedAt && article.updatedAt !== article.publishedAt ? ` · Updated ${article.updatedAt}` : ''}
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
            <div className="text-sm font-semibold text-slate-50">Want automation instead of firefighting?</div>
            <p className="mt-2 text-sm text-slate-300">Early Access is limited. Quantify exposure and start implementation before enforcement.</p>
            <div className="mt-4 flex gap-4">
              <a href="/#pricing" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">View pricing →</a>
              <Link to="/app/onboarding" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Go to onboarding →</Link>
            </div>
          </div>
        </article>
      </Container>
    </main>
  )
}
