import { fetchJSON } from './apiClient.js'
import { getStoredAttribution } from '../utils/attribution.js'

export async function login({ email, password }) {
  const data = await fetchJSON('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false
  })
  if (data?.token) localStorage.setItem('token', data.token)
  return data
}

/**
 * Sign up payload for backend: fullName, email, password, companyName, companyType (optional), UTM (optional).
 * Responses: { user, token } | { ok, user, token } → session stored, redirect to app;
 *            { status: 'pending_approval' } or { pendingApproval: true } → show success/waitlist UI;
 *            { message } only (incomplete backend) → no token stored.
 */
export async function signup(payload) {
  const att = getStoredAttribution()
  const body = {
    fullName: payload.fullName?.trim(),
    email: payload.email?.trim().toLowerCase(),
    password: payload.password,
    companyName: payload.companyName?.trim(),
    companyType: payload.companyType || undefined,
    utm_source: att.utm_source,
    utm_medium: att.utm_medium,
    utm_campaign: att.utm_campaign,
    utm_term: att.utm_term,
    utm_content: att.utm_content,
    referrer: att.referrer
  }
  const data = await fetchJSON('/auth/signup', {
    method: 'POST',
    body,
    auth: false
  })
  if (data?.status === 'pending_approval' || data?.pendingApproval) {
    return { pendingApproval: true, message: data?.message }
  }
  if (data?.token) {
    localStorage.setItem('token', data.token)
    return { success: true, user: data?.user }
  }
  if (data?.ok && data?.token) {
    localStorage.setItem('token', data.token)
    return { success: true, user: data?.user }
  }
  return { success: false, message: data?.message }
}

export async function me() {
  return fetchJSON('/auth/me')
}

export function logout() {
  localStorage.removeItem('token')
}
