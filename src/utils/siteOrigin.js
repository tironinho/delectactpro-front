/**
 * Canonical site origin for canonical URLs, sitemap, og:url.
 * Prefer VITE_SITE_URL in build; fallback to window.location.origin in browser.
 */
export function getSiteOrigin() {
  const env = import.meta.env?.VITE_SITE_URL
  if (env && typeof env === 'string' && env.startsWith('http')) return env.replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return 'https://deleteactpro.com'
}
