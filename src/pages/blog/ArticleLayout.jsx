import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import { Link } from 'react-router-dom'

export default function ArticleLayout({ title, description, canonicalPath, children }) {
  return (
    <main className="bg-slate-950">
      <Seo title={title} description={description} canonicalPath={canonicalPath} />
      <Container className="py-16">
        <div className="mb-8">
          <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-slate-50">
            ← Back to landing
          </Link>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">{title}</h1>
          <p className="mt-4 text-lg text-slate-300">{description}</p>

          <div className="mt-10 space-y-6 text-[15px] leading-7 text-slate-300">
            {children}
          </div>

          <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <div className="text-sm font-semibold text-slate-50">Want automation instead of firefighting?</div>
            <p className="mt-2 text-sm text-slate-300">
              Early Access is limited. Quantify exposure and start implementation before enforcement.
            </p>
            <a href="/#pricing" className="mt-4 inline-flex text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">
              View pricing →
            </a>
          </div>
        </div>
      </Container>
    </main>
  )
}
