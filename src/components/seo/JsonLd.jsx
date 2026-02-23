import { Helmet } from 'react-helmet-async'
import { getSiteOrigin } from '../../utils/siteOrigin.js'

const SITE_NAME = 'DROP Compliance Gateway'

/**
 * JSON-LD: Article, FAQPage, BreadcrumbList, Organization, WebSite+SearchAction.
 * Use article + faqs for blog; breadcrumbs for article pages; organization/website for home.
 */
export default function JsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  url,
  faqs = [],
  breadcrumbs = [],
  organization = false,
  website = false
}) {
  const origin = getSiteOrigin()

  const scripts = []

  if (title && url) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description || undefined,
      datePublished: publishedAt,
      dateModified: updatedAt || publishedAt,
      url: url.startsWith('http') ? url : `${origin}${url.startsWith('/') ? '' : '/'}${url}`
    })
  }

  if (faqs.length > 0) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer }
      }))
    })
  }

  if (breadcrumbs.length > 0) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url ? (item.url.startsWith('http') ? item.url : `${origin}${item.url.startsWith('/') ? '' : '/'}${item.url}`) : undefined
      }))
    })
  }

  if (organization) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: origin,
      description: 'Automation-first compliance tooling for California DROP / SB 362.'
    })
  }

  if (website) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', url: `${origin}/blog?q={search_term_string}` },
        'query-input': 'required name=search_term_string'
      }
    })
  }

  return (
    <Helmet>
      {scripts.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  )
}
