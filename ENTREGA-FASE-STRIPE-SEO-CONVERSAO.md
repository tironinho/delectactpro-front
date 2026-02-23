# Entrega — Stripe, SEO e Conversão (DeleteActPro)

## 1) Arquivos criados / alterados

### Novos
- `src/utils/attribution.js` — UTM + referrer, persistência, getStoredLead/setStoredLead
- `src/utils/siteOrigin.js` — getSiteOrigin() (VITE_SITE_URL / fallback)
- `src/pages/billing/BillingSuccess.jsx` — confirmação pago, next steps, CTAs
- `src/pages/billing/BillingCancel.jsx` — cancelamento, FAQ cobrança, CTAs
- `src/pages/solutions/DataBrokers.jsx` — página comercial data brokers
- `src/pages/use-cases/DropApiReadiness.jsx` — use case DROP API readiness
- `src/pages/pricing/SetupFeeEarlyAccess.jsx` — página pricing setup fee + CheckoutButton
- `src/pages/compare/ManualVsAutomated.jsx` — comparação manual vs automatizado
- `src/content/blog/categories.js` — BLOG_CATEGORIES e BLOG_TAXONOMY_SLUGS
- `src/content/blog/hubs.js` — HUB_SLUGS e HUB_META (6 hubs)
- `src/content/blog/index.js` — re-export articles + hubs (estrutura para escala)

### Alterados
- `src/services/stripeService.js` — createCheckoutSession com planId, sourcePage, referrer, UTM, leadId, email; normalizeApiPath; hasStripeKey()
- `src/components/CheckoutButton.jsx` — estados idle/loading/error, mensagens amigáveis, onCheckoutStarted/onCheckoutError, aria-busy, foco
- `src/components/Pricing.jsx` — microcopy Setup Fee, trust copy, CTA “Talk to Sales (procurement)”
- `src/components/EarlyAccessForm.jsx` — setStoredLead após submit (leadId/email/company)
- `src/components/Seo.jsx` — robots, og, twitter, ogType, og:site_name, keywords
- `src/components/SEOHead.jsx` — getSiteOrigin(), ogType, og:site_name
- `src/components/seo/JsonLd.jsx` — Article, FAQPage, BreadcrumbList, Organization, WebSite+SearchAction
- `src/components/Footer.jsx` — seções Solutions, Use Cases, Product & Pricing, Compliance Resources, Tools
- `src/App.jsx` — getMarketingAttribution() no mount; rotas billing/success|cancel, solutions, use-cases, pricing, compare
- `src/pages/Home.jsx` — JsonLd organization + website
- `src/pages/blog/BlogArticle.jsx` — breadcrumbs visíveis, reading time, last updated, CTA por categoria (técnico/audit/risk)
- `src/pages/blog/BlogIndex.jsx` — links para hubs, busca client-side, filtro categoria, ordenação, “Start here” e “Most important before Aug 1, 2026”
- `src/content/blog/articles.js` — 2 novos hubs (dsar-automation-roi-hub, shadow-broker-compliance-hub); JSDoc campos opcionais
- `scripts/generate-sitemap.mjs` — robots.txt, sitemap.xml (índice), sitemap-pages.xml, sitemap-blog.xml; baseUrl VITE_SITE_URL | SITEMAP_BASE_URL; Disallow /app/, /billing/success, /billing/cancel; rotas estáticas novas

## 2) Rotas novas

| Rota | Descrição |
|------|-----------|
| `/billing/success` | Sucesso pagamento Stripe |
| `/billing/cancel` | Cancelamento checkout |
| `/solutions/data-brokers` | Página comercial data brokers |
| `/use-cases/drop-api-readiness` | Use case DROP API |
| `/pricing/setup-fee-early-access` | Setup fee + Early Access |
| `/compare/manual-vs-automated-delete-act-compliance` | Manual vs automatizado |

## 3) Configuração .env

```env
# API do backend (com ou sem /api)
VITE_API_BASE_URL=https://api.deleteactpro.com

# Stripe (checkout)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Site canonical (canonical, sitemap, robots)
VITE_SITE_URL=https://deleteactpro.com
```

Para build de sitemap/robots no prebuild, no ambiente de CI pode-se usar:
`SITEMAP_BASE_URL=https://deleteactpro.com` ou `VITE_SITE_URL=https://deleteactpro.com`.

## 4) Resumo das melhorias de SEO

- **Seo.jsx / SEOHead:** title, description, keywords, canonical, robots, noindex, og:title, og:description, og:url, og:type, og:site_name, og:image, twitter:card, twitter:title, twitter:description.
- **Canonical e domínio:** `getSiteOrigin()` em `src/utils/siteOrigin.js` usa `VITE_SITE_URL` ou fallback; usado em Seo, SEOHead, JsonLd e BillingSuccess/Cancel.
- **JSON-LD:** Article, FAQPage, BreadcrumbList (em BlogArticle), Organization e WebSite+SearchAction (em Home).
- **BlogArticle:** breadcrumbs visíveis, reading time estimado, “Last updated”, CTA contextual (técnico → early access, audit → audit logs, risk → penalty calculator).
- **BlogIndex:** hubs no topo, busca por título/keywords, filtro por categoria, ordenação (newest / updated), blocos “Start here” e “Most important before Aug 1, 2026”.
- **robots.txt:** Allow /, blog, tools, login, signup; Disallow /app/, /billing/success, /billing/cancel; Sitemap com base URL configurável.
- **Sitemap:** índice (sitemap.xml) apontando para sitemap-pages.xml e sitemap-blog.xml; base URL via env.

## 5) Quantidade de artigos

- **Total atual:** 56 artigos (incluindo 6 hubs).
- A estrutura está pronta para crescer: `src/content/blog/index.js`, `categories.js` e `hubs.js` permitem adicionar módulos em `src/content/blog/articles/*.js` (ex.: enforcement.js, dropApi.js) e re-exportar em `index.js` para chegar a 150–250 artigos sem monolito.

---

*Build verificado: `npm run build` concluído com sucesso.*
