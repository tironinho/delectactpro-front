import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description, canonicalPath }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = origin && canonicalPath ? `${origin}${canonicalPath}` : undefined

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {url ? <link rel="canonical" href={url} /> : null}
    </Helmet>
  )
}
