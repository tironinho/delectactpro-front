import { fetchJSON } from './apiClient.js'

export async function login({ email, password }) {
  const data = await fetchJSON('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false
  })
  if (data?.token) localStorage.setItem('token', data.token)
  return data
}

export async function signup({ email, password, name }) {
  const data = await fetchJSON('/auth/signup', {
    method: 'POST',
    body: { email, password, name },
    auth: false
  })
  if (data?.token) localStorage.setItem('token', data.token)
  return data
}

export async function me() {
  return fetchJSON('/auth/me')
}

export function logout() {
  localStorage.removeItem('token')
}
