import { Helmet } from 'react-helmet-async'

/**
 * JSON-LD for Article + FAQ (schema.org)
 * @param {{ title: string; description: string; publishedAt: string; updatedAt?: string; url: string; faqs?: { question: string; answer: string }[] }} props
 */
export default function JsonLd({ title, description, publishedAt, updatedAt, url, faqs = [] }) {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    url
  }

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer }
          }))
        }
      : null

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(article)}</script>
      {faqSchema ? <script type="application/ld+json">{JSON.stringify(faqSchema)}</script> : null}
    </Helmet>
  )
}
