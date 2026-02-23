# DROP Compliance Gateway (Vite + React + Tailwind) + Backend (TS/Express)

Professional dark-mode landing built to sell automated compliance for California DELETE Act (SB 362 / DROP).

## Prereqs
- Node.js 18+ (recommended 20+)

## 1) Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, CLIENT_URL, ADMIN_TOKEN
npm run dev
```

Health check:
- GET http://localhost:4242/health

## 2) Frontend
```bash
cd ..
npm install
cp .env.example .env
# Fill VITE_STRIPE_PUBLISHABLE_KEY
npm run dev
```

Frontend env should point to backend:
- `VITE_API_BASE_URL=http://localhost:4242`

## Stripe
- Frontend uses `@stripe/stripe-js` and redirects to Stripe Checkout.
- Backend creates Checkout Session for the **$999 Setup Fee** and receives webhooks at `/webhook`.

## Admin (Backend)
Protected endpoints require:
`Authorization: Bearer <ADMIN_TOKEN>`

Example:
```bash
curl -H "Authorization: Bearer dev_admin_token_change_me" http://localhost:4242/api/admin/leads
```
