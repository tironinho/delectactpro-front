/**
 * API client with base URL normalization and response helpers.
 * VITE_API_BASE_URL may be "http://localhost:4242" or "http://localhost:4242/api".
 */
const rawBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4242').replace(/\/$/, '')
const baseURL = rawBase

/** Avoid double /api when base already has it. path should start with / (e.g. /api/app/connectors). */
export function normalizeApiPath(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  if (rawBase.endsWith('/api') && p.startsWith('/api')) {
    return `${rawBase}${p.slice(4)}`
  }
  return `${rawBase}${p}`
}

/** Normalize list responses: accept { items }, { connectors }, { partners }, etc. or raw array. */
const LIST_KEYS = ['items', 'connectors', 'partners', 'integrations', 'runs', 'recipes', 'policies']
export function toList(data, keys = LIST_KEYS) {
  if (data == null) return []
  if (Array.isArray(data)) return data
  for (const k of keys) {
    if (Array.isArray(data[k])) return data[k]
  }
  return []
}

function getToken() {
  return localStorage.getItem('token')
}

/**
 * @param {string} path - path with prefix (e.g. /api/app/connectors or /auth/me)
 * @param {{ method?: string; body?: object; auth?: boolean }} opts
 */
export async function fetchJSON(path, { method = 'GET', body, auth = true } = {}) {
  const url = path.startsWith('http') ? path : normalizeApiPath(path)
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (auth && token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(res.ok ? text : `Request failed: ${res.status} ${text}`)
  }

  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `Request failed: ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export { baseURL, getToken }
