import { fetchJSON } from './apiClient.js'

// Integration mode (Agent vs Customer APIs) — backend may return which is configured
export async function getIntegrationSummary() {
  return fetchJSON('/app/integrations/summary').catch(() => ({ connectors: [], customerApis: [] }))
}

// Connectors (Agent)
export async function listConnectors() {
  return fetchJSON('/app/connectors')
}
export async function createConnector({ name, db_type }) {
  return fetchJSON('/app/connectors', { method: 'POST', body: { name, db_type } })
}
export async function rotateConnectorToken(connectorId) {
  return fetchJSON(`/app/connectors/${connectorId}/rotate-token`, { method: 'POST' })
}

// Customer APIs
export async function listCustomerApis() {
  return fetchJSON('/app/customer-apis').catch(() => ({ integrations: [] }))
}
export async function createCustomerApi(payload) {
  return fetchJSON('/app/customer-apis', { method: 'POST', body: payload })
}
export async function updateCustomerApi(id, payload) {
  return fetchJSON(`/app/customer-apis/${id}`, { method: 'PATCH', body: payload })
}
export async function deleteCustomerApi(id) {
  return fetchJSON(`/app/customer-apis/${id}`, { method: 'DELETE' })
}
export async function testCustomerApiHealth(id) {
  return fetchJSON(`/app/customer-apis/${id}/test-health`, { method: 'POST' })
}
export async function testCustomerApiDelete(id, sampleSubjectHash = '') {
  return fetchJSON(`/app/customer-apis/${id}/test-delete`, { method: 'POST', body: { sampleSubjectHash: sampleSubjectHash || undefined } })
}
export async function testCustomerApiStatus(id) {
  return fetchJSON(`/app/customer-apis/${id}/test-status`, { method: 'POST' })
}
export async function rotateCustomerApiSecret(id) {
  return fetchJSON(`/app/customer-apis/${id}/rotate-secret`, { method: 'POST' })
}

// Hash recipes (metadata only; hashing is client-side)
export async function listHashRecipes() {
  return fetchJSON('/app/hash-recipes')
}
export async function createHashRecipe(payload) {
  return fetchJSON('/app/hash-recipes', { method: 'POST', body: payload })
}
export async function updateHashRecipe(id, payload) {
  return fetchJSON(`/app/hash-recipes/${id}`, { method: 'PATCH', body: payload })
}
export async function deleteHashRecipe(id) {
  return fetchJSON(`/app/hash-recipes/${id}`, { method: 'DELETE' })
}
export async function setActiveHashRecipe(id) {
  return fetchJSON(`/app/hash-recipes/${id}/activate`, { method: 'POST' })
}

// Partners
export async function listPartners() {
  return fetchJSON('/app/partners')
}
export async function createPartner(payload) {
  return fetchJSON('/app/partners', { method: 'POST', body: payload })
}
export async function updatePartner(id, payload) {
  return fetchJSON(`/app/partners/${id}`, { method: 'PATCH', body: payload })
}
export async function deletePartner(id) {
  return fetchJSON(`/app/partners/${id}`, { method: 'DELETE' })
}

// Cascade policies — target = connector OR customerApiIntegration
export async function listCascadePolicies() {
  return fetchJSON('/app/cascade-policies')
}
export async function upsertCascadePolicy(payload) {
  return fetchJSON('/app/cascade-policies', { method: 'PUT', body: payload })
}
export async function dispatchCascadeTest() {
  return fetchJSON('/app/admin/dispatch', { method: 'POST' })
}

// Runs
export async function listRuns(params = {}) {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/app/runs${q ? `?${q}` : ''}`)
}
export async function getRun(runId) {
  return fetchJSON(`/app/runs/${runId}`)
}

// Audit logs
export async function getAuditLogs(params = {}) {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/app/audit${q ? `?${q}` : ''}`)
}
export async function exportAuditPacket(params = {}) {
  const q = new URLSearchParams(params).toString()
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4242'
  const token = localStorage.getItem('token')
  const res = await fetch(`${baseURL}/app/audit/export${q ? `?${q}` : ''}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) throw new Error(`Export failed: ${res.status}`)
  return res.blob()
}

// Billing
export async function getBillingStatus() {
  return fetchJSON('/app/billing')
}
export async function getCustomerPortalUrl() {
  const data = await fetchJSON('/app/billing/portal-url', { method: 'POST' })
  return data?.url
}
