const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4242'

function getToken() {
  return localStorage.getItem('token')
}

/**
 * @param {string} path - path (e.g. /auth/me)
 * @param {{ method?: string; body?: object; auth?: boolean }} opts
 */
export async function fetchJSON(path, { method = 'GET', body, auth = true } = {}) {
  const url = path.startsWith('http') ? path : `${baseURL}${path}`
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
