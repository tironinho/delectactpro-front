/**
 * Blog content facade. Re-exports from articles and hubs for scalability.
 * Add articles/*.js modules here when splitting the monolith.
 */

export {
  BLOG_CATEGORIES,
  BLOG_TAXONOMY_SLUGS,
  PILLAR_SLUGS,
  articles,
  getArticleBySlug,
  getArticlesByCategory,
  getCategoryKeyBySlug
} from './articles.js'

export { HUB_SLUGS, HUB_META } from './hubs.js'
