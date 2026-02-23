import { Helmet } from 'react-helmet-async'
import { getSiteOrigin } from '../utils/siteOrigin.js'

/**
 * Reusable SEO head: title, description, keywords, canonical, og, twitter.
 * Use on every page (including blog articles and hub pages).
 */
export default function SEOHead({
  title,
  description,
  keywords = [],
  canonicalPath,
  ogImage,
  ogType = 'website',
  noindex = false
}) {
  const origin = getSiteOrigin()
  const canonicalUrl = canonicalPath ? `${origin}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}` : undefined
  const imageUrl = ogImage ? (ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`) : undefined
  const keywordStr = Array.isArray(keywords) ? keywords.join(', ') : keywords

  return (
    <Helmet>
      {title != null && title !== '' ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {keywordStr ? <meta name="keywords" content={keywordStr} /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {/* Open Graph */}
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="DROP Compliance Gateway" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
    </Helmet>
  )
}
